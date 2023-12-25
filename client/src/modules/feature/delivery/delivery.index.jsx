import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useClientContext } from "../../../utilities/context/client.context"
import DataIndex from '../../../utilities/interface/datastack/data.index'
import DeliveryManage from './delivery.manage'
import DeliveryRecords from './delivery.records'
import { searchDelivery } from './delivery.services'

const DeliveryIndex = () => {
    const { search } = useClientContext()
    const name = 'Delivery'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => searchDelivery(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => { refetch() }, [search])

    return (
        (manage) ? (
            <DeliveryManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <DeliveryRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default DeliveryIndex