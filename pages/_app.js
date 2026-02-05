import Head from "next/head";
import { useEffect } from "react";
import "../styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import InvisibleCaptchaGate from "../components/Captcha/InvisibleCaptchaGate";

function MyApp({ Component, pageProps }) {
  return (
    // <InvisibleCaptchaGate>
      <Component {...pageProps} />
    // </InvisibleCaptchaGate>
  );
}

export default MyApp;
