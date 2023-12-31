import React, { createContext, useState, useEffect } from "react"
import io from "socket.io-client"

const SOCKET_SERVER_URL = "http://localhost:3000"
export const SignalContext = createContext()

export const useSignals = ({ onSignalsUpdate = null }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL)
    setSocket(newSocket)

    if (onSignalsUpdate) {
      newSocket.on("signalsUpdate", onSignalsUpdate)
    }

    return () => {
      if (onSignalsUpdate) {
        newSocket.off("signalsUpdate", onSignalsUpdate)
      }
      newSocket.close()
    }
  }, [])

  const sendSignal = (signalData) => {
    if (socket) {
      socket.emit("sendSignal", signalData)
    }
  }

  return {
    socket,
    sendSignal,
  }
}
