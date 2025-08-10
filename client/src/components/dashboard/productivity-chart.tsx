import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  interface Window {
    Chart: any;
  }
}

interface ProductivityChartProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export function ProductivityChart({ period = "week", onPeriodChange }: ProductivityChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/productivity/metrics'],
  });

  useEffect(() => {
    // Load Chart.js if not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => initChart();
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [metrics]);

  const initChart = () => {
    if (!chartRef.current || !window.Chart) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Generate sample data for the last 5 work days
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const data = metrics?.length > 0 
      ? metrics.slice(0, 5).reverse().map((m: any) => parseFloat(m.focusHours || "0"))
      : [6.5, 7.2, 5.8, 8.1, 6.9];

    chartInstanceRef.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Focus Hours',
          data,
          backgroundColor: 'hsl(203.8863, 88.2845%, 53.1373%)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productivity Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Productivity Patterns</CardTitle>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="lastweek">Last week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
