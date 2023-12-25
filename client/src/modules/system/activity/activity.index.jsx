import React, { useState } from 'react'
import { useQuery } from "react-query"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import ActivityRecords from "./activity.records"

const ActivityIndex = () => {
    const { data, isLoading, isError, refetch } = useQuery("activity-index")
    const [id, setId] = useState()
    const name = "Activity"

    return (
        <DataIndex
            data={data}
            name={name}
            isError={isError}
            isLoading={isLoading}
        >
            <ActivityRecords
                setter={setId}
                refetch={refetch}
                data={data?.result || []}
            />
        </DataIndex >
    )
}

export default ActivityIndex