"use client"

import React, { useRef, useState, useContext, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSignals } from "./useSignals"
import { MeshLine, MeshLineMaterial } from "three.meshline"
import { SocketContext } from "../context/SocketContext"

const Stream = ({ centralNodePosition, targetNodePosition, signalInfo }) => {
  const [signals, setSignals] = useState(
    signalInfo
      .map((signal) => signal.type)
      .reduce((prev, curr) => {
        prev[curr] = []
        return prev
      }, {})
  )

  const onSignalsUpdate = useCallback((data) => {
    setSignals(data)
  }, [])

  const socket = useContext(SocketContext)
  const _ = useSignals(socket, { onSignalsUpdate })

  const createMeshLine = (signalData, color, baseOffset) => {
    const range = 2
    const movingAverage = (index) => {
      let sum = 0
      let count = 0
      for (let i = -range; i <= range; i++) {
        const dataIndex = index + i
        if (dataIndex >= 0 && dataIndex < signalData.length) {
          sum += signalData[dataIndex].avg_strength
          count += 1
        }
      }
      return sum / count
    }

    const smoothedData = signalData.map((signal, index) => ({
      ...signal,
      avg_strength: movingAverage(index),
    }))

    const lineLength = centralNodePosition.distanceTo(targetNodePosition)
    const direction = targetNodePosition
      .clone()
      .sub(centralNodePosition)
      .normalize()

    // Add zero values to the beginning and end of the data
    // so that the line starts and ends at the central node
    const extendedData = [
      { avg_strength: 0 },
      ...signalData,
      { avg_strength: 0 },
    ]

    let points = extendedData.map((signal, index) => {
      // Calculate the position along the line based on index and signal strength
      const positionAlongLine = (index / smoothedData.length) * lineLength

      const offsetAlongDirection = direction
        .clone()
        .multiplyScalar(positionAlongLine)

      const perpendicularOffset = new THREE.Vector3(
        -direction.y,
        direction.x,
        0
      )
        .normalize()
        .multiplyScalar(signal.avg_strength)

      const additionalOffset = new THREE.Vector3(direction.z, 0, -direction.x)
        .normalize()
        .multiplyScalar(baseOffset)

      return centralNodePosition
        .clone()
        .add(offsetAlongDirection)
        .add(perpendicularOffset)
        .add(additionalOffset)
    })

    if (points.length < 2) {
      // Not enough points to create a curve
      return null
    }

    const curve = new THREE.CatmullRomCurve3(points)
    const curvePoints = curve.getPoints(200)

    const line = new MeshLine()
    line.setPoints(
      curvePoints.flatMap((point) => point.toArray()),
      (p) => 0.075
    )

    const material = new MeshLineMaterial({
      color: color,
      transparent: true,
      opacity: 0.75,
      lineWidth: 0.35,
      toneMapped: false,
    })

    const mesh = new THREE.Mesh(line, material)

    return <primitive object={mesh} />
  }

  return (
    <>
      {signalInfo.map((signal, i) => {
        return createMeshLine(signals[signal.type], signal.color, i * 0.05)
      })}
    </>
  )
}

export default Stream
