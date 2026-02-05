import { useEffect } from "react";

export function useHideRecaptchaBadge(active = true) {
  useEffect(() => {
    if (!active) return;
    const style = document.createElement("style");
    style.id = "hide-recaptcha-badge";
    style.innerHTML = `.grecaptcha-badge{visibility:hidden !important;}`;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, [active]);
} 