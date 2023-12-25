import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from "react-router-dom"
import { useClientContext } from '../../../utilities/context/client.context'
import { searchCustomer } from "../../library/customer/customer.services"
import CreditsRecords from './credits.records'

const CreditsIndex = () => {
    const location = useLocation()
    const { handleTrail, search } = useClientContext()
    const name = 'Credits'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => searchCustomer(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    useEffect(() => { refetch() }, [search])

    return (
        <div className="flex flex-col py-6 px-4 sm:px-6 lg:px-8 h-full">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto no-select">
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">{name.toUpperCase()}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all entries registered in the system.
                    </p>
                </div>
            </div>
            <CreditsRecords
                setter={setId}
                manage={setManage}
                refetch={refetch}
                data={data?.result || []}
            />
        </div>
    )
}

export default CreditsIndex