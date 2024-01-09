import React, { createContext, useState, useEffect } from "react"
import io from "socket.io-client"

export const SignalContext = createContext()

export const useSignals = (socket, options = {}) => {
  const { onSignalsUpdate = null } = options

  useEffect(() => {
    if (socket && onSignalsUpdate) {
      socket.on("signalsUpdate", onSignalsUpdate)
    }

    return () => {
      if (socket && onSignalsUpdate) {
        socket.off("signalsUpdate", onSignalsUpdate)
      }
    }
  }, [socket])

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
