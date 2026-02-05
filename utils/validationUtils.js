/**
 * Validation utilities for phone numbers and emails
 */

/**
 * Validates if a phone number is valid and has sufficient length for masking
 * @param {string} tel - The phone number to validate
 * @returns {boolean} - True if valid and maskable
 */
export const isValidPhoneNumber = (tel) => {
  if (!tel || typeof tel !== "string") return false;

  // Remove all non-digit characters
  const cleanTel = tel.replace(/\D/g, "");

  // Check if it has at least 6 digits (minimum for masking with 3 at start + 2 at end)
  if (cleanTel.length < 6) return false;

  // Check if it's a reasonable phone number length (between 6 and 15 digits)
  if (cleanTel.length > 15) return false;

  return true;
};

/**
 * Validates if an email address is valid
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;

  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check basic format
  if (!emailRegex.test(email)) return false;

  // Check minimum length for masking (at least 6 characters before @)
  const atIndex = email.indexOf("@");
  if (atIndex < 3) return false;

  return true;
};

/**
 * Creates a masked phone number display
 * @param {string} tel - The phone number to mask
 * @returns {string} - Masked phone number or fallback message
 */
export const getMaskedPhoneDisplay = (tel) => {
  if (!isValidPhoneNumber(tel)) {
    return "your phone number";
  }

  const cleanTel = tel.replace(/\D/g, "");
  return `${cleanTel.substring(0, 3)}*******${cleanTel.substring(
    cleanTel.length - 2
  )}`;
};

/**
 * Creates a masked email display
 * @param {string} email - The email to mask
 * @returns {string} - Masked email or fallback message
 */
export const getMaskedEmailDisplay = (email) => {
  if (!isValidEmail(email)) {
    return "your email";
  }

  const atIndex = email.indexOf("@");
  return `${email.substring(0, 3)}******${email.substring(atIndex)}`;
};

/**
 * Creates a display message for dual email scenario (Email + BusinessEmail)
 * @param {string} email - Primary email
 * @param {string} businessEmail - Business email
 * @returns {string} - Formatted message for both emails or fallback
 */
export const getDualEmailDisplay = (email, businessEmail) => {
  const validEmail = isValidEmail(email);
  const validBusinessEmail = isValidEmail(businessEmail);

  if (!validEmail && !validBusinessEmail) {
    return "your email";
  }

  if (validEmail && validBusinessEmail) {
    return `${getMaskedEmailDisplay(email)} (${getMaskedEmailDisplay(
      businessEmail
    )})`;
  }

  if (validEmail) {
    return getMaskedEmailDisplay(email);
  }

  return getMaskedEmailDisplay(businessEmail);
};
