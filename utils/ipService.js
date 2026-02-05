import axios from "axios";
import { buildApiUrl } from "../config/api";
import {
  retryWithBackoff,
  RETRY_CONFIGS,
  fetchWithTimeout,
} from "./retryUtils";

export class IPService {
  static async fetchIPAddress() {
    return retryWithBackoff(async () => {
      try {
        const response = await fetchWithTimeout(
          "https://api.ipify.org?format=json",
          {},
          8000
        );

        if (!response.ok) {
          const error = new Error(
            `HTTP ${response.status}: ${response.statusText}`
          );
          error.response = { status: response.status };
          throw error;
        }

        const data = await response.json();

        if (!data.ip) {
          throw new Error("Invalid response: IP address not found");
        }

        return data.ip;
      } catch (error) {
        console.error("Error fetching IP address:", error);
        throw error;
      }
    }, RETRY_CONFIGS.EXTERNAL_API);
  }

  static async fetchLocationData(ip) {
    return retryWithBackoff(async () => {
      try {
        const response = await fetchWithTimeout(
          `https://ipapi.co/${ip}/json`,
          {},
          8000
        );

        if (!response.ok) {
          const error = new Error(
            `HTTP ${response.status}: ${response.statusText}`
          );
          error.response = { status: response.status };
          throw error;
        }

        const data = await response.json();

        // Handle API-specific error responses
        if (data.error) {
          throw new Error(`Location API error: ${data.reason || data.error}`);
        }

        return {
          country: data.country || null,
          city: data.city || null,
        };
      } catch (error) {
        console.error("Error fetching location data:", error);
        throw error;
      }
    }, RETRY_CONFIGS.EXTERNAL_API);
  }

  static async checkBan(ip) {
    return retryWithBackoff(async () => {
      try {
        const response = await axios.get(buildApiUrl(`/api/checkBan/${ip}`), {
          timeout: 8000,
        });
        return response.data.data;
      } catch (error) {
        console.error("Error checking ban:", error);
        throw error;
      }
    }, RETRY_CONFIGS.INTERNAL_API);
  }

  static async banIP(ip) {
    return retryWithBackoff(async () => {
      try {
        await axios.get(buildApiUrl(`/api/ban/${ip}`), {
          timeout: 8000,
        });
        return true;
      } catch (error) {
        console.error("Error banning IP:", error);
        throw error;
      }
    }, RETRY_CONFIGS.INTERNAL_API);
  }

  static async redirectToBannedSite() {
    window.location.href = "https://www.ferrari.com/en-EN/corporate/career";
  }
}
