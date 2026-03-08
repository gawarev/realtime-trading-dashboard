import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type {LiveTick, OHLCBar, TimeRange} from '../../types/market';

interface PriceChartProps {
    ticker: string;
    range: TimeRange;
    historicalData: OHLCBar[] | null;
    liveTicks: LiveTick[];
}

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler);

function formatTime(ts: string): string {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
}

export function PriceChart({ range, historicalData, liveTicks }: PriceChartProps) {
    let labels: string[];
    let values: number[];

    if (range === '1D') {
        labels = liveTicks.map(t => formatTime(t.timestamp));
        values = liveTicks.map(t => t.price);
    } else {
        const rows = historicalData ?? [];
        labels = rows.map(r => r.date);
        values = rows.map(r => r.close);
    }

    const isPositive = values.length < 2 || values[values.length - 1] >= values[0];
    const lineColor = isPositive ? '#22c55e' : '#ef4444';
    const fillColor = isPositive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)';

    const data = {
        labels,
        datasets: [
            {
                data: values,
                borderColor: lineColor,
                backgroundColor: fillColor,
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: { parsed: { y: number } }) => `₹${ctx.parsed.y.toFixed(2)}`,
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    maxTicksLimit: 6,
                    color: '#888',
                    font: { size: 11 },
                },
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    color: '#888',
                    font: { size: 11 },
                    callback: (value: number | string) => `₹${Number(value).toFixed(0)}`,
                }
            }
        }
    };

    if (values.length === 0) {
        return <div className="chart-empty">Waiting for data…</div>;
    }

    return (
        <div className="chart-wrapper">
            <Line data={data} options={options as object} />
        </div>
    );

}