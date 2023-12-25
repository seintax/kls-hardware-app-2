import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DataIndex from '../../../utilities/interface/datastack/data.index'
import { searchMasterlist } from './masterlist.services'

import { useClientContext } from "../../../utilities/context/client.context"
import MasterlistManage from './masterlist.manage'
import MasterlistRecords from './masterlist.records'
const MasterlistIndex = () => {
    const { search } = useClientContext()
    const name = 'Masterlist'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => searchMasterlist(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => { refetch() }, [search])

    return (
        (manage) ? (
            <MasterlistManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <MasterlistRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default MasterlistIndex