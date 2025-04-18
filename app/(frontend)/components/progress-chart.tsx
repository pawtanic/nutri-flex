"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"

interface ProgressChartProps {
  title: string
  period: string
  type: "workout" | "nutrition" | "water"
}

export function ProgressChart({ title, period, type }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate sample data based on period and type
  const generateData = () => {
    let labels: string[] = []
    let data: number[] = []

    switch (period) {
      case "week":
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        break
      case "month":
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
        break
      case "3months":
        labels = ["Jan", "Feb", "Mar"]
        break
      case "year":
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        break
    }

    // Generate random data based on type
    if (type === "workout") {
      data = labels.map(() => Math.floor(Math.random() * 3) + 1) // 1-3 workouts
    } else if (type === "nutrition") {
      data = labels.map(() => Math.floor(Math.random() * 500) + 1500) // 1500-2000 calories
    } else {
      data = labels.map(() => Math.floor(Math.random() * 4) + 4) // 4-8 glasses
    }

    return { labels, data }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { labels, data } = generateData()

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find max value for scaling
    const maxValue = Math.max(...data)
    const scale = chartHeight / maxValue

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw bars
    const barWidth = chartWidth / labels.length / 2
    const barSpacing = chartWidth / labels.length

    data.forEach((value, index) => {
      const x = padding + barSpacing * index + barSpacing / 4
      const barHeight = value * scale
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = type === "workout" ? "#3b82f6" : type === "nutrition" ? "#22c55e" : "#0ea5e9"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(labels[index], x + barWidth / 2, height - padding + 15)

      // Draw value
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    })
  }, [period, type])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} width={300} height={200} className="w-full" />
      </CardContent>
    </Card>
  )
}
