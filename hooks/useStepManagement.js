import { useState } from "react";

export const useStepManagement = () => {
  const [Step, setStep] = useState(1);
  const [LastFetch, setLastFetch] = useState("");
  const [wrong2faTrigger, setWrong2faTrigger] = useState(0);
  const [wrongPasswordTrigger, setWrongPasswordTrigger] = useState(0);

  return {
    Step,
    setStep,
    LastFetch,
    setLastFetch,
    wrong2faTrigger,
    setWrong2faTrigger,
    wrongPasswordTrigger,
    setWrongPasswordTrigger,
  };
};
