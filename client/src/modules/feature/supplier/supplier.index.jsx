import { useEffect, useState } from 'react'
import { useQuery } from "react-query"
import { useClientContext } from "../../../utilities/context/client.context"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import SupplierManage from "./supplier.manage"
import SupplierRecords from "./supplier.records"
import { searchSupplier } from "./supplier.services"

const SupplierIndex = () => {
    const { search } = useClientContext()
    const name = "Supplier"
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => searchSupplier(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => { refetch() }, [search])

    return (
        (manage) ? (
            <SupplierManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <SupplierRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default SupplierIndex