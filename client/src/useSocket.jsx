import io from "socket.io-client";
import { useCallback, useEffect, useRef } from "react";

const serverURL = "http://localhost:8080";

const subscriptions = ["final", "partial", "transcriber-ready", "error"];

const useSocket = () => {
  const socketRef = useRef(null); // Use a ref to store the socket instance

  // Initialize the WebSocket connection
  const initialize = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(serverURL, {
        transports: ["websocket"],
      });
  
      // Subscribe to events
      subscriptions.forEach((event) => {
        socketRef.current.on(event, (data) => {
          console.log(`Received ${event}:`, data);
        });
      });
    }
    return socketRef.current; // Return the socket instance
  }, []);

  // Disconnect the WebSocket connection
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null; // Clear the ref
    }
  }, []);

  // Initialize and cleanup WebSocket connection
  useEffect(() => {
    initialize(); // Initialize the socket connection

    // Cleanup on component unmount
    return () => {
      disconnect();
    };
  }, [initialize, disconnect]);

  // Send data to the server
  const sendData = useCallback((event, data) => {
    console.log('getting called', data)
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    } else {
      console.error('Socket is not initialized');
    }
  }, []);

  return { initialize, disconnect, sendData };
};

export default useSocket;