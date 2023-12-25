import { useState } from 'react'
import { useQuery } from 'react-query'
import DataIndex from '../../../utilities/interface/datastack/data.index'
import { fetchCategory } from './category.services'

import CategoryManage from './category.manage'
import CategoryRecords from './category.records'
const CategoryIndex = () => {
    const name = 'Category'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchCategory())
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    return (
        (manage) ? (
            <CategoryManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <CategoryRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default CategoryIndex