import { useState } from 'react'
import { useQuery } from 'react-query'
import DataIndex from '../../../utilities/interface/datastack/data.index'
import { fetchMeasurement } from './measurement.services'

import MeasurementManage from './measurement.manage'
import MeasurementRecords from './measurement.records'
const MeasurementIndex = () => {
    const name = 'Measurement'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchMeasurement())
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    return (
        (manage) ? (
            <MeasurementManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <MeasurementRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default MeasurementIndex