import React, { useState } from 'react'
import { useQuery } from "react-query"
import ReportsRecords from "./reports.records"

const ReportsIndex = () => {
    const { data, isLoading, isError, refetch } = useQuery("reports-index")
    const [id, setId] = useState()
    const name = "Reports"

    return (
        <div className="p-10 flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">REPORTS</h1>
            <p className="mt-2 text-sm text-gray-700">
                A list of all reports required in the system.
            </p>
            <ReportsRecords
                setter={setId}
                refetch={refetch}
                data={data?.result || []}
            />
        </div>
    )
}

export default ReportsIndex