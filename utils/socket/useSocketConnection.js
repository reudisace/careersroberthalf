import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getSocketUrl as getConfiguredSocketUrl } from "../../config/api";

// Socket configuration
const SOCKET_CONFIG = {
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  timeout: 10000,
  autoConnect: false,
};

// Global socket instance and state
let socket = null;
let currentUserId = null;
let isInitialized = false;
let eventListenersAdded = false;
let connectionCount = 0;

// Debug function
const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Socket Debug] ${message}`, data || "");
  }
};

// Initialize socket connection
const initializeSocket = () => {
  if (typeof window === "undefined") return socket;

  if (socket) {
    debugLog("Socket already exists, returning existing instance");
    return socket;
  }

  connectionCount++;
  debugLog(`Initializing socket connection #${connectionCount}`);

  socket = io(getConfiguredSocketUrl(), SOCKET_CONFIG);

  // Add base event listeners only once
  if (!eventListenersAdded) {
    debugLog("Adding socket event listeners");

    socket.on("connect", () => {
      debugLog("Socket connected", socket.id);
      // Re-add user if we have one
      if (currentUserId) {
        socket.emit("add-user", { userId: currentUserId });
      }
    });

    socket.on("disconnect", (reason) => {
      debugLog("Socket disconnected", reason);
    });

    socket.on("connect_error", (error) => {
      debugLog("Socket connection error", error.message);
    });

    socket.on("error", (error) => {
      debugLog("Socket error", error.message);
    });

    eventListenersAdded = true;
  }

  // Auto-disconnect on page unload
  const handleBeforeUnload = () => {
    debugLog("Page unload - cleaning up socket");
    cleanup();
  };

  // Remove existing listener to prevent duplicates
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("beforeunload", handleBeforeUnload);

  return socket;
};

// Socket manager functions
const addUser = (userId) => {
  if (!userId || !socket) {
    debugLog("Cannot add user - missing userId or socket", {
      userId: !!userId,
      socket: !!socket,
    });
    return false;
  }

  currentUserId = userId;

  if (socket.connected) {
    debugLog("Adding user to socket", userId);
    socket.emit("add-user", { userId });
    return true;
  } else {
    debugLog("Socket not connected, cannot add user", userId);
  }
  return false;
};

const updateUser = (userId, data) => {
  if (!socket || !socket.connected) {
    debugLog("Cannot update user - socket not connected", {
      userId,
      connected: socket?.connected,
    });
    return false;
  }

  debugLog("Updating user data", userId);
  socket.emit("update-user", { userId, data });
  return true;
};

// Cleanup function
const cleanup = () => {
  if (socket) {
    debugLog("Cleaning up socket connection");
    socket.disconnect();
    socket = null;
    currentUserId = null;
    isInitialized = false;
    eventListenersAdded = false;
  }
};

export const useSocketConnection = (Unik, AllData) => {
  const initRef = useRef(false);
  const lastDataRef = useRef(null);
  const cleanupRef = useRef(false);

  // Initialize socket once per app lifecycle
  useEffect(() => {
    if (typeof window === "undefined" || initRef.current) return;

    initRef.current = true;

    // Handle React Strict Mode double initialization
    if (isInitialized) {
      debugLog("Socket already initialized globally, skipping...");
      return;
    }

    isInitialized = true;
    debugLog("Starting socket initialization");

    const socketInstance = initializeSocket();

    if (socketInstance && !socketInstance.connected) {
      debugLog("Connecting socket");
      socketInstance.connect();
    }

    // Cleanup function for component unmount
    return () => {
      if (!cleanupRef.current) {
        cleanupRef.current = true;
        debugLog("Component unmounting - cleaning up");
        cleanup();
      }
    };
  }, []);

  // Handle user registration
  useEffect(() => {
    if (!Unik || !socket) return;

    debugLog("Handling user registration", Unik);

    // Add user when socket is connected
    if (socket.connected) {
      addUser(Unik);
    } else {
      // Wait for connection
      const handleConnect = () => {
        addUser(Unik);
        socket.off("connect", handleConnect);
      };
      socket.on("connect", handleConnect);

      return () => {
        if (socket) {
          socket.off("connect", handleConnect);
        }
      };
    }
  }, [Unik]);

  // Handle data updates
  useEffect(() => {
    if (!Unik || !AllData || !socket) return;

    // Check if data has changed
    const currentDataString = JSON.stringify(AllData);
    if (
      currentDataString !== lastDataRef.current &&
      Object.keys(AllData).length > 0
    ) {
      debugLog("Data changed, updating user", Unik);
      updateUser(Unik, AllData);
      lastDataRef.current = currentDataString;
    }
  }, [Unik, AllData]);
};
