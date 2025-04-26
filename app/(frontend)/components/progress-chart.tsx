'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import { Period, periodValue, Tabs, tabsValues } from '@/app/(frontend)/utils/constants';

interface ProgressChartProps {
  title: string;
  period: Period;
  type: Tabs;
}

const getLabelsForTimePeriod = (period: Period): string[] => {
  switch (period) {
    case periodValue.week:
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case periodValue.month:
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    case periodValue['3months']:
      return ['Jan', 'Feb', 'Mar'];
    case periodValue.year:
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    default:
      return [];
  }
};

const generateRandomValuesByActivityType = (type: Tabs, labels: string[]): number[] => {
  switch (type) {
    case tabsValues.workout:
      return labels.map(() => Math.floor(Math.random() * 3) + 1); // 1-3 workouts
    case tabsValues.nutrition:
      return labels.map(() => Math.floor(Math.random() * 500) + 1500); // 1500-2000 calories
    default:
      return labels.map(() => Math.floor(Math.random() * 4) + 4); // 4-8 glasses
  }
};

const generateChartData = (period: Period, type: ProgressChartProps['type']) => {
  const labels = getLabelsForTimePeriod(period);
  const data = generateRandomValuesByActivityType(type, labels);
  return { labels, data };
};

export function ProgressChart({ title, period, type }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, data } = generateChartData(period, type);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find max value for scaling
    const maxValue = Math.max(...data);
    const scale = chartHeight / maxValue;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    const barWidth = chartWidth / labels.length / 2;
    const barSpacing = chartWidth / labels.length;

    data.forEach((value, index) => {
      const x = padding + barSpacing * index + barSpacing / 4;
      const barHeight = value * scale;
      const y = height - padding - barHeight;

      // Draw bar
      ctx.fillStyle = type === tabsValues.nutrition ? 'hsl(92, 86%, 68%)' : '';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index], x + barWidth / 2, height - padding + 15);

      // Draw value
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
  }, [period, type]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <canvas ref={canvasRef} width={400} height={200} className="w-full" />
    </Card>
  );
}
