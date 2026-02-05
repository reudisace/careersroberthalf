import { useEffect, useState, createContext, useContext } from "react";
import Script from "next/script";
import Image from "next/image";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Context to expose captcha token if other components need it
const CaptchaContext = createContext({ token: null });

export const useCaptcha = () => useContext(CaptchaContext);

const SplashScreen = ({ isVisible }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-out",
        pointerEvents: isVisible ? "all" : "none",
      }}
    >
      <div
        style={{
          animation: "pulsate 1.5s ease-in-out infinite",
        }}
      >
        <Image src="/favicon.ico" alt="Logo" width={68} height={68} />
      </div>
      <style jsx global>{`
        @keyframes pulsate {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default function InvisibleCaptchaGate({ children }) {
  const [contentReady, setContentReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [token, setToken] = useState(null);
  const [startTime] = useState(Date.now());

  const handleSetReady = (tok = null) => {
    const elapsed = Date.now() - startTime;
    const minDisplayTime = 600; // 600ms minimum display time

    if (elapsed < minDisplayTime) {
      // Wait for the remaining time to reach 600ms
      setTimeout(() => {
        setToken(tok);
        setContentReady(true);
        // Start fade out animation
        setShowSplash(false);
      }, minDisplayTime - elapsed);
    } else {
      setToken(tok);
      setContentReady(true);
      // Start fade out animation
      setShowSplash(false);
    }
  };

  useEffect(() => {
    if (!SITE_KEY) {
      console.warn(
        "InvisibleCaptchaGate: NEXT_PUBLIC_RECAPTCHA_SITE_KEY not set. Skipping CAPTCHA."
      );
      handleSetReady();
      return;
    }

    const initCaptcha = () => {
      if (!window.grecaptcha) return;

      // Render an invisible widget into a detached div
      const container = document.createElement("div");
      document.body.appendChild(container);

      const widgetId = window.grecaptcha.render(container, {
        sitekey: SITE_KEY,
        size: "invisible",
        badge: "bottomright",
        callback: (tok) => {
          handleSetReady(tok);
        },
        "error-callback": () => {
          console.error(
            "reCAPTCHA error callback – allowing user through (fail-open)."
          );
          handleSetReady();
        },
      });

      try {
        window.grecaptcha.execute(widgetId);
      } catch (err) {
        console.error("reCAPTCHA execute error", err);
        handleSetReady(); // fail-open
      }
    };

    // If script already present
    if (window.grecaptcha) {
      initCaptcha();
    } else {
      window.__initInvisibleCaptcha = initCaptcha;
    }
  }, []);

  return (
    <CaptchaContext.Provider value={{ token }}>
      {!contentReady && (
        <Script
          id="recaptcha-invisible"
          src="https://www.google.com/recaptcha/api.js?onload=__initInvisibleCaptcha&render=explicit"
          strategy="afterInteractive"
          async
          defer
        />
      )}

      {/* Render content once ready, even during fade-out */}
      {contentReady && children}

      {/* Splash screen overlay */}
      <SplashScreen isVisible={showSplash} />
    </CaptchaContext.Provider>
  );
}
