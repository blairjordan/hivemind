"use client"

import React, { useState, useContext, useCallback } from "react"
import { useSignals } from "./useSignals"
import { Line } from "react-chartjs-2"
import { SocketContext } from "../context/SocketContext"
import Chart from "chart.js/auto"

const SignalVisualizer = ({ signalInfo }) => {
  const signalTypesInitState = signalInfo.reduce((prev, curr) => {
    prev[curr.type] = []
    return prev
  }, {})

  const [signals, setSignals] = useState(signalTypesInitState)

  const onSignalsUpdate = useCallback((data) => {
    setSignals(data)
  }, [])

  const socket = useContext(SocketContext)
  const _ = useSignals(socket, { onSignalsUpdate })

  const chartData = {
    labels: Array.from({ length: 61 }, () => ""),
    datasets: signalInfo.map((signal) => ({
      label: signal.label,
      data: signals[signal.type]
        ? signals[signal.type].map((signal) => signal.avg_strength)
        : [],
      backgroundColor: signal.color,
      borderColor: signal.color,
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      fill: "origin",
    })),
  }

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 1,
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div style={{ width: "600px", height: "400px" }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default SignalVisualizer
