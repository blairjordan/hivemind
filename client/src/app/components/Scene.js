// "use client" directive for client-side rendering
"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSignals } from "./useSignals"
import { MeshLine, MeshLineMaterial } from "three.meshline"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { easing } from "maath"

const Scene = () => {
  const [signals, setSignals] = useState({
    love: [],
    think: [],
    sex: [],
    anger: [],
  })

  const onSignalsUpdate = useCallback((data) => {
    setSignals(data)
  }, [])

  const _ = useSignals({ onSignalsUpdate })

  const createMeshLine = (signalData, color, offset) => {
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

    let points = []
    smoothedData.forEach((signal, index) => {
      points.push(
        new THREE.Vector3(index * 0.1 - 3, signal.avg_strength, 1 - offset)
      )
    })

    if (points.length < 2) {
      // Not enough points to create a curve
      return null
    }

    const curve = new THREE.CatmullRomCurve3(points)
    const curvePoints = curve.getPoints(100)

    const line = new MeshLine()
    line.setPoints(
      curvePoints.flatMap((point) => point.toArray()),
      (p) => 0.1
    )

    const material = new MeshLineMaterial({
      color: color,
      transparent: true,
      opacity: 0.75,
      lineWidth: 1,
      toneMapped: false,
    })

    const mesh = new THREE.Mesh(line, material)

    return <primitive object={mesh} />
  }

  return (
    <Canvas style={{ width: "600px", height: "600px" }}>
      <OrbitControls />
      <color attach="background" args={["#000000"]} />

      {createMeshLine(signals.love, "#EE786E", 0)}
      {createMeshLine(signals.think, "#81E0DB", 0.1)}
      {createMeshLine(signals.sex, "#BB39B2", 0.2)}
      {createMeshLine(signals.anger, "#868686", 0.3)}
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} radius={0.6} intensity={0.65} />
      </EffectComposer>
    </Canvas>
  )
}

export default Scene
