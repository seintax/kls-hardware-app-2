import { useState } from 'react'
import { useQuery } from 'react-query'
import DataIndex from '../../../utilities/interface/datastack/data.index'
import { fetchDiscount } from './discount.services'

import DiscountManage from './discount.manage'
import DiscountRecords from './discount.records'
const DiscountIndex = () => {
    const name = 'Discount'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchDiscount())
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    return (
        (manage) ? (
            <DiscountManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <DiscountRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default DiscountIndex