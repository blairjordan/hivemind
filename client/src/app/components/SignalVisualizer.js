"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { useSignals } from "./useSignals"
import * as THREE from "three"

const SignalVisualizer = () => {
  const [signals, setSignals] = useState([])

  const onSignalsUpdate = useCallback((data) => {
    setSignals(data.slice(0, 50)) // Limit to 50 signals for performance
    console.log("Received signal strength update:", data)
  }, [])

  const _ = useSignals({ onSignalsUpdate })

  const mountRef = useRef(null)
  const sceneRef = useRef(new THREE.Scene()) // Use a ref for the scene

  const createBar = (signal, index, totalSignals) => {
    const barWidth = Math.min(2, 200 / totalSignals) // Adjust bar width
    const barHeight = signal.avg_strength * 30
    const barGeometry = new THREE.BoxGeometry(barWidth, barHeight, 1)
    const barMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const bar = new THREE.Mesh(barGeometry, barMaterial)

    const positionX = index * (barWidth + 1) - (totalSignals * barWidth) / 2
    bar.position.set(positionX, barHeight / 2, 0)
    sceneRef.current.add(bar)

    return bar
  }
  useEffect(() => {
    const scene = sceneRef.current
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    mountRef.current.appendChild(renderer.domElement)

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      mountRef.current.removeChild(renderer.domElement)
      while (scene.children.length > 0) {
        scene.remove(scene.children[0])
      }
    }
  }, [signals])

  useEffect(() => {
    const scene = sceneRef.current
    while (scene.children.length > 0) {
      const object = scene.children[0]
      object.geometry.dispose()
      object.material.dispose()
      scene.remove(object)
    }
    signals.forEach((signal, index) => {
      createBar(signal, index, signals.length)
    })
  }, [signals])

  return <div ref={mountRef}></div>
}

export default SignalVisualizer
