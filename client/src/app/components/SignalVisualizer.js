"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useSignals } from "./useSignals"
import { Line } from "react-chartjs-2"
import Chart from "chart.js/auto"

const SignalVisualizer = () => {
  const [signals, setSignals] = useState({
    love: [],
    think: [],
  })

  const onSignalsUpdate = useCallback((data) => {
    setSignals(data)
  }, [])

  const _ = useSignals({ onSignalsUpdate })

  const chartData = {
    labels: Array.from({ length: 61 }, () => ""),
    datasets: [
      {
        label: "Love Signal Strength",
        data: signals.love.map((signal) => signal.avg_strength),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: "origin",
      },
      {
        label: "Think Signal Strength",
        data: signals.think.map((signal) => signal.avg_strength),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: "origin",
      },
    ],
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
