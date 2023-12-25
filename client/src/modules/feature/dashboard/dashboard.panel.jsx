import moment from "moment"
import React, { useEffect } from 'react'
import { useQuery } from "react-query"
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { fetchDailySummary } from "../../system/reports/reports.services"
import DashboardCards from "./dashboard.cards"
import DashboardGraph from "./dashboard.graph"

const DashboardPanel = ({ id }) => {
    const location = useLocation()
    const name = "Dashboard"
    const { handleTrail, user } = useClientContext()
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchDailySummary(moment(new Date()).subtract(3, 'days').format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")))

    useEffect(() => {
        handleTrail(location.pathname.split("/").filter(path => path !== id).join("/"))
    }, [location])

    return (
        <div className="w-full h-full overflow-y-auto text-white bg-gradient-to-r from-[#1b0372] to-[#700474] flex flex-col items-start p-5">
            <div className="w-full h-full flex flex-col bg-black bg-opacity-[40%] rounded-[30px] p-3 ">
                <div className="absolute px-10 py-2 rounded-tl-[20px] rounded-br-[20px] bg-gradient-to-r from-[#1b0372] to-[#700474] border border-1 border-[#b317a3]">Welcome🎉🎉🎉&emsp;{user?.name}</div>
                <DashboardCards data={data} />
                <div className="flex h-full mt-[20px]">
                    <DashboardGraph />
                </div>
            </div>
        </div>
    )
}

export default DashboardPanel