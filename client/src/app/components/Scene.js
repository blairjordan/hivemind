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
  })

  const onSignalsUpdate = useCallback((data) => {
    setSignals(data)
  }, [])

  const _ = useSignals({ onSignalsUpdate })

  const createMeshLine = (signalData, color, offset) => {
    let points = []
    signalData.forEach((signal, index) => {
      points.push(index * 0.1 - 5, 0, 4 - offset)
    })

    const line = new MeshLine()
    line.setPoints(
      points,
      (p) =>
        signalData[Math.floor(p * (signalData.length - 1))].avg_strength * 1
    )

    const material = new MeshLineMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      lineWidth: 1,
      toneMapped: false,
      emissive: color,
      emissiveIntensity: 1,
    })

    const mesh = new THREE.Mesh(line, material)

    return <primitive object={mesh} />
  }

  return (
    <Canvas style={{ width: "500px", height: "350px" }}>
      <OrbitControls />
      <color attach="background" args={["#000000"]} />

      {createMeshLine(signals.love, "#EE786E", 0)}
      {createMeshLine(signals.think, "#e0feff", -0.1)}
      {createMeshLine(signals.sex, "#BB39B2", -0.2)}
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} radius={0.6} intensity={0.65} />
      </EffectComposer>
    </Canvas>
  )
}

export default Scene
