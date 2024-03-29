"use client"

import React, { useState, useEffect, useContext } from "react"
import { SocketContext } from "../context/SocketContext"
import { useSignals } from "./useSignals"

const SLOT_COUNT = 10
const MAX_DURATION = 1000

const FROM_UUID = "00000000-0000-0000-0000-000000000001"
const TO_UUID = "00000000-0000-0000-0000-000000000002"

function KeyPressComponent({ triggerKey, signalType, icon }) {
  const socket = useContext(SocketContext)
  const { sendSignal } = useSignals(socket)
  const [isKeyPressed, setIsKeyPressed] = useState(false)
  const [keydownTime, setKeydownTime] = useState(0)
  const [durations, setDurations] = useState(new Array(SLOT_COUNT).fill(0))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentVelocity, setCurrentVelocity] = useState(0)

  const calculateVelocity = () => {
    let newDurations = [...durations]
    if (isKeyPressed) {
      const ongoingDuration = Math.min(Date.now() - keydownTime, MAX_DURATION)
      newDurations[currentIndex] = ongoingDuration
    } else {
      newDurations[currentIndex] = 0
    }

    const totalDuration = newDurations.reduce((a, b) => a + b, 0)
    const maxPossibleDuration = SLOT_COUNT * MAX_DURATION
    setCurrentVelocity(totalDuration / maxPossibleDuration)
    setDurations(newDurations)
    setCurrentIndex((currentIndex + 1) % SLOT_COUNT)

    if (currentVelocity === 0) {
      return
    }

    // write to socket
    if (socket) {
      sendSignal({
        from: FROM_UUID,
        to: TO_UUID,
        type: signalType,
        strength: currentVelocity,
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(calculateVelocity, 100)
    return () => clearInterval(interval)
  }, [isKeyPressed, keydownTime, durations, currentIndex, currentVelocity])

  const handleKeyDown = (e) => {
    if (
      !isKeyPressed &&
      (e.key === triggerKey || e.key === triggerKey.toUpperCase())
    ) {
      setKeydownTime(Date.now())
      setIsKeyPressed(true)
    }
  }

  const handleKeyUp = (e) => {
    if (
      isKeyPressed &&
      (e.key === triggerKey || e.key === triggerKey.toUpperCase())
    ) {
      setIsKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isKeyPressed])

  return (
    <div>
      <p>
        {icon}: {currentVelocity.toFixed(2)}
      </p>
      {/* <p>{isKeyPressed ? "⌨ key pressed" : "⌨ key released"}</p> */}
    </div>
  )
}

export default KeyPressComponent
