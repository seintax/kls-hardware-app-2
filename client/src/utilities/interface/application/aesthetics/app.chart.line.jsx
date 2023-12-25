import { Chart as ChartJS, registerables } from 'chart.js'
import React from 'react'
import { Line } from "react-chartjs-2"
ChartJS.register(...registerables)

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            ticks: { color: '#ffffff', padding: 30, font: { size: 10 } }
        },
        x: {
            ticks: { color: '#04ddfa', padding: 30, font: { size: 10 } }
        }
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: "#ffffff",
            }
        },
        title: {
            display: true,
            text: 'Sales Summary Data for the Past 15 Days',
            color: '#ffffff'
        }
    }
}

function AppLineChart({ data }) {
    return (
        <Line data={data} options={options} className="h-full" />
    )
}

export default AppLineChart