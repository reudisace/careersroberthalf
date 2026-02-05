/**
 * Retry utility with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {Object} options - Retry configuration options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.baseDelay - Base delay in milliseconds (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in milliseconds (default: 10000)
 * @param {Function} options.shouldRetry - Function to determine if error should trigger retry
 * @param {Function} options.onRetry - Callback function called on each retry attempt
 * @returns {Promise} - Promise that resolves with the function result or rejects with the final error
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
    onRetry = () => {},
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if we should retry this error
      if (!shouldRetry(error, attempt)) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

      // Call retry callback
      onRetry(error, attempt + 1, delay);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Predefined retry configurations for different types of operations
 */
export const RETRY_CONFIGS = {
  // For external API calls (IP services, location services)
  EXTERNAL_API: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    shouldRetry: (error, attempt) => {
      // Retry on network errors, timeouts, and 5xx status codes
      if (error.name === "TypeError" && error.message.includes("fetch"))
        return true;
      if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT")
        return true;
      if (error.response?.status >= 500) return true;
      if (error.response?.status === 429) return true; // Rate limiting
      return false;
    },
    onRetry: (error, attempt, delay) => {
      console.warn(
        `External API call failed (attempt ${attempt}), retrying in ${delay}ms:`,
        error.message
      );
    },
  },

  // For internal API calls (to your backend)
  INTERNAL_API: {
    maxRetries: 2,
    baseDelay: 500,
    maxDelay: 4000,
    shouldRetry: (error, attempt) => {
      // Retry on network errors and 5xx status codes
      if (error.name === "TypeError" && error.message.includes("fetch"))
        return true;
      if (error.code === "NETWORK_ERROR") return true;
      if (error.response?.status >= 500) return true;
      return false;
    },
    onRetry: (error, attempt, delay) => {
      console.warn(
        `Internal API call failed (attempt ${attempt}), retrying in ${delay}ms:`,
        error.message
      );
    },
  },

  // For critical operations that must succeed
  CRITICAL: {
    maxRetries: 5,
    baseDelay: 2000,
    maxDelay: 15000,
    shouldRetry: (error, attempt) => {
      // Retry on most errors except 4xx client errors (except 429)
      if (
        error.response?.status >= 400 &&
        error.response?.status < 500 &&
        error.response?.status !== 429
      ) {
        return false;
      }
      return true;
    },
    onRetry: (error, attempt, delay) => {
      console.warn(
        `Critical operation failed (attempt ${attempt}), retrying in ${delay}ms:`,
        error.message
      );
    },
  },
};

/**
 * Enhanced fetch with timeout support
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<Response>} - Promise that resolves with the fetch response
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      const timeoutError = new Error(`Request timeout after ${timeout}ms`);
      timeoutError.code = "TIMEOUT";
      throw timeoutError;
    }
    throw error;
  }
};
