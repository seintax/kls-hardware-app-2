import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useClientContext } from '../../../utilities/context/client.context'
import DataIndex from '../../../utilities/interface/datastack/data.index'
import CustomerManage from './customer.manage'
import CustomerRecords from './customer.records'
import { fetchCustomer } from "./customer.services"

const CustomerIndex = () => {
    const { search } = useClientContext()
    const name = 'Customer'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchCustomer(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => { refetch() }, [search])

    return (
        (manage) ? (
            <CustomerManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <CustomerRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default CustomerIndex