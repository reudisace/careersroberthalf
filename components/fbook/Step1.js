import React from "react";
import Form from "../common/Form.js";

function Step1({
  setStep,
  Unik,
  setIp,
  Ip,
  BusinessEmail,
  setBusinessEmail,
  setContinueWithFacebook,
  Tel,
  Email,
  setEmail,
  Name,
  InvalidPassword,
  wrongPasswordTrigger,
}) {
  return (
    <Form
      setStep={setStep}
      Unik={Unik}
      setIp={setIp}
      Ip={Ip}
      BusinessEmail={BusinessEmail}
      setBusinessEmail={setBusinessEmail}
      setContinueWithFacebook={setContinueWithFacebook}
      Tel={Tel}
      Email={Email}
      setEmail={setEmail}
      Name={Name}
      InvalidPassword={InvalidPassword}
      wrongPasswordTrigger={wrongPasswordTrigger}
    />
  );
}

export default Step1;
