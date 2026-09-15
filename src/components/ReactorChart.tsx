import { useEffect, useRef } from 'react';
/* tree-shaken Chart.js build — only the pieces this trace needs */
import {
  Chart, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';

Chart.register(
  LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
);

/* ============================================================
   REACTOR CHART — Chart.js telemetry traces.
   Reads live CSS custom properties so the plot re-themes with
   the light/dark toggle, and cleans up its instance properly.
   ============================================================ */
export function ReactorChart({
  labels,
  series,
  height = 210,
  unit = 'MW',
}: {
  labels: string[];
  series: { label: string; data: number[]; color: string; dashed?: boolean; fill?: boolean }[];
  height?: number;
  unit?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const css = getComputedStyle(document.documentElement);
    const readVar = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;

    const txt = readVar('--dim', '#97a3b3');
    const grid = 'rgba(255,255,255,0.07)';
    const mono = "'IBM Plex Mono', monospace";
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const grad = (color: string) => {
      const g = canvas.getContext('2d');
      if (!g) return color;
      const grd = g.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, `${color}66`);
      grd.addColorStop(1, `${color}00`);
      return grd;
    };

    chartRef.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: series.map((s) => ({
          label: s.label,
          data: s.data,
          borderColor: s.color,
          borderWidth: s.dashed ? 1.4 : 2.2,
          borderDash: s.dashed ? [5, 4] : undefined,
          backgroundColor: s.fill ? grad(s.color) : 'transparent',
          fill: s.fill ? 'origin' : false,
          tension: 0.36,
          pointRadius: 0,
          pointHoverRadius: 4.5,
          pointHoverBackgroundColor: s.color,
          pointHoverBorderColor: readVar('--bg', '#08090d'),
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduced ? false : { duration: 900, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 6 } },
        plugins: {
          legend: {
            display: series.length > 1,
            labels: {
              color: txt,
              font: { family: mono, size: 10 },
              boxWidth: 14, boxHeight: 2, usePointStyle: false,
            },
          },
          tooltip: {
            backgroundColor: readVar('--panel-solid', '#12151d'),
            borderColor: readVar('--line-strong', 'rgba(255,255,255,0.22)'),
            borderWidth: 1,
            titleColor: readVar('--txt', '#f2f5f8'),
            bodyColor: txt,
            titleFont: { family: mono, size: 10 },
            bodyFont: { family: mono, size: 11 },
            padding: 10,
            displayColors: true,
            boxWidth: 8, boxHeight: 8,
            callbacks: {
              label: (c) => ` ${c.dataset.label}: ${c.parsed.y}${unit}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: grid, drawTicks: false },
            border: { display: false },
            ticks: { color: readVar('--faint', '#66717f'), font: { family: mono, size: 9 }, maxRotation: 0, autoSkipPadding: 14 },
          },
          y: {
            grid: { color: grid, drawTicks: false },
            border: { display: false },
            ticks: { color: readVar('--faint', '#66717f'), font: { family: mono, size: 9 }, callback: (v) => `${v}${unit}` },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [labels, series, height, unit]);

  return (
    <div style={{ height }} className="relative w-full">
      <canvas ref={canvasRef} aria-label={`Reactor telemetry — ${series.map((s) => s.label).join(', ')}`} role="img" />
    </div>
  );
}
