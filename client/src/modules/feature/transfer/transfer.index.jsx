import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useClientContext } from '../../../utilities/context/client.context'
import DataIndex from '../../../utilities/interface/datastack/data.index'
import TransferManage from './transfer.manage'
import TransferRecords from './transfer.records'
import { searchTransfer } from './transfer.services'

const TransferIndex = () => {
    const { search } = useClientContext()
    const name = 'Transfer'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => searchTransfer(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => { refetch() }, [search])

    return (
        (manage) ? (
            <TransferManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <TransferRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default TransferIndex