import React, { useState, useEffect, useContext } from "react";
import Step2Mobile from "./Step2Mobile";
import Step2PC from "./Step2PC";

const Step2 = (props) => {
  const [isMobile, setIsMobile] = useState(false);
  const { setStep } = props;
  const [beginTimer, setBeginTimer] = useState(false);

  // Pass beginTimer state and setter to child components
  const enhancedProps = {
    ...props,
    parentBeginTimer: beginTimer,
    setParentBeginTimer: setBeginTimer,
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize(); // Initial check

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  useEffect(() => {
    // Only trigger navigation if NOT being used as a modal (onClose means it's a modal)
    if (beginTimer && !props.onClose) {
      const timer = setTimeout(() => {
        setStep(3);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [beginTimer, setStep, props.onClose]);

  if (isMobile) {
    return <Step2Mobile {...enhancedProps} />;
  }

  return <Step2PC {...enhancedProps} />;
};

export default Step2;
