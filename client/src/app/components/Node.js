"use client"

import React from "react"
import * as THREE from "three"
import { Text, Billboard } from "@react-three/drei"

const Node = ({ position, color, label, key }) => {
  return (
    <group key={key}>
      <mesh position={position.toArray()}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissiveIntensity={0.6}
          emissive={color}
        />
      </mesh>
      <group
        position={new THREE.Vector3(position.x, position.y + 0.1, position.z)}
      >
        <Billboard>
          <Text fontSize={0.1} color="white">
            {label}
          </Text>
        </Billboard>
      </group>
    </group>
  )
}

export default Node
