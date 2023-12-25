import moment from "moment"
import React, { useEffect, useState } from 'react'
import AppLineChart from "../../../utilities/interface/application/aesthetics/app.chart.line"
import { fetchWeeklySummary } from "../../system/reports/reports.services"

const DashboardGraph = () => {
    const [week, setweek] = useState()
    const [line, setline] = useState()

    useEffect(() => {
        const weeklySales = async () => {
            let weekly = await fetchWeeklySummary(moment(new Date()).subtract(15, 'days').format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"))
            setweek(weekly?.result)
            setline({
                labels: weekly?.result?.map((data) => moment(data.day).format("MM-DD-YYYY")),
                datasets: [
                    {
                        label: `  ${"Cash Sales"}`,
                        data: weekly?.result?.map((data) => data.cash),
                        borderColor: '#88df8f',
                        color: '#ffffff',
                        backgroundColor: ["#02680b"],
                        pointStyle: 'circle',
                        pointRadius: 8,
                        pointHoverRadius: 15
                    },
                    {
                        label: `  ${"Cheque Sales"}`,
                        data: weekly?.result?.map((data) => data.cheque),
                        borderColor: '#df9588',
                        color: '#ffffff',
                        backgroundColor: ["#680e02"],
                        pointStyle: 'circle',
                        pointRadius: 8,
                        pointHoverRadius: 15
                    },
                    {
                        label: `  ${"GCash Sales"}`,
                        data: weekly?.result?.map((data) => data.gcash),
                        borderColor: '#889cdf',
                        color: '#ffffff',
                        backgroundColor: ["#022668"],
                        pointStyle: 'circle',
                        pointRadius: 8,
                        pointHoverRadius: 15
                    }
                ]
            })
        }

        weeklySales()
    }, [])


    return (
        <div className="flex w-full h-full p-5 border border-1 border-[#b317a3] rounded-[20px]">
            {line ? <AppLineChart data={line} /> : null}
        </div>
    )
}

export default DashboardGraph