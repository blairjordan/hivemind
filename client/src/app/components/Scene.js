// "use client" directive for client-side rendering
"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls, OrthographicCamera } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import Stream from "./Stream"

const Scene = ({ signalInfo }) => {
  const centralNodePosition = new THREE.Vector3(0, 0, 0)

  const generateRandomPositions = (radius, count) => {
    let positions = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const distance = radius
      const x = centralNodePosition.x + distance * Math.cos(angle)
      const y = centralNodePosition.y + distance * Math.sin(angle)
      positions.push(new THREE.Vector3(x, y, 0))
    }
    return positions
  }

  const userPositions = generateRandomPositions(2, 5)

  const createUserSphere = (position, color, key) => {
    return (
      <mesh position={position.toArray()} key={key}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissiveIntensity={0.6}
          emissive={color}
        />
      </mesh>
    )
  }

  return (
    <Canvas style={{ width: "600px", height: "600px" }}>
      <OrthographicCamera
        makeDefault
        position={[0, 0, 5]}
        near={0.1}
        far={100}
        zoom={100}
      />
      <OrbitControls />
      <color attach="background" args={["#000000"]} />

      {userPositions.map((userPosition, index) => {
        return (
          <Stream
            centralNodePosition={centralNodePosition}
            targetNodePosition={userPosition}
            key={`stream_${index}`}
            signalInfo={signalInfo}
          />
        )
      })}

      {createUserSphere(centralNodePosition, "white", "me")}
      {userPositions.map((userPosition, index) => {
        const color = "#FFFFFF"
        return createUserSphere(userPosition, color, `user_${index}`)
      })}
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} radius={0.6} intensity={0.65} />
      </EffectComposer>
    </Canvas>
  )
}

export default Scene
