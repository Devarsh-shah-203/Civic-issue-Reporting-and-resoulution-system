"use client";

import { createContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export const SocketContext = createContext(null);

// Simple local event bus so features (like live notifications) work
// in demo mode even when no Socket.IO server is running yet.
function createLocalBus() {
  const listeners = new Map();
  return {
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(cb);
    },
    off(event, cb) {
      listeners.get(event)?.delete(cb);
    },
    emit(event, payload) {
      listeners.get(event)?.forEach((cb) => cb(payload));
    },
  };
}

export function SocketProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const busRef = useRef(createLocalBus());

  useEffect(() => {
    if (!user) return undefined;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 2,
      timeout: 4000,
      autoConnect: true,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("connect_error", () => setConnected(false));
    socket.on("disconnect", () => setConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const emitLocal = useCallback((event, payload) => {
    busRef.current.emit(event, payload);
  }, []);

  const onLocal = useCallback((event, cb) => {
    busRef.current.on(event, cb);
    return () => busRef.current.off(event, cb);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        emitLocal,
        onLocal,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
