/**
 * Configuration utility for Fa2 components
 * Handles feature flags and timeout configurations
 */

export const FA2_CONFIG = {
  // Feature flag: true = wait for timeout, false = show error in 1 second (default: true)
  WAIT_FOR_TIMEOUT: process.env.NEXT_PUBLIC_FA2_WAIT_FOR_TIMEOUT !== 'false',
  
  // Timeout in seconds after valid code submission (default: 60 seconds)
  TIMEOUT_DURATION: parseInt(process.env.NEXT_PUBLIC_FA2_TIMEOUT) || 60,
};

/**
 * Get the timeout duration in milliseconds
 * @returns {number} Timeout duration in milliseconds
 */
export const getTimeoutDuration = () => {
  return FA2_CONFIG.TIMEOUT_DURATION * 1000;
};

/**
 * Check if should wait for timeout (true) or show error quickly (false)
 * @returns {boolean} True if should wait for timeout, false if show error in 1 second
 */
export const shouldWaitForTimeout = () => {
  return FA2_CONFIG.WAIT_FOR_TIMEOUT;
};

/**
 * Debug logging for development
 * @param {string} message 
 * @param {any} data 
 */
export const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[FA2 Config] ${message}`, data || '');
  }
}; 