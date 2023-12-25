import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from "react-router-dom"
import { useClientContext } from '../../../utilities/context/client.context'
import RequestRecords from './request.records'
import { fetchRequestForStatus } from './request.services'

const RequestIndex = () => {
    const { search, handleTrail } = useClientContext()
    const location = useLocation()
    const name = 'Request'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchRequestForStatus(["REQUESTING"]))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    useEffect(() => { refetch() }, [search])

    return (
        <div className='flex flex-col px-4 sm:px-6 lg:px-8 h-full'>
            <RequestRecords
                setter={setId}
                manage={setManage}
                refetch={refetch}
                data={data?.result || []}
            />
        </div>
    )
}

export default RequestIndex