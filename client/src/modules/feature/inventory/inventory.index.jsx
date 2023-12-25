import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useClientContext } from "../../../utilities/context/client.context"
import InventoryNavigate from "./inventory.navigate"
import InventoryRecords from './inventory.records'
import { searchInventory } from "./inventory.services"

const InventoryIndex = () => {
    const { search, setSearch } = useClientContext()
    const name = 'Inventory'
    const [showErrors, setShowErrors] = useState(false)
    const [printable, setprintable] = useState([])
    const { data, isLoading, isError, refetch } = useQuery([`${name.toLowerCase()}-index`, search], async (e) => {
        return await searchInventory(e.queryKey[1].key, e.queryKey[1].all.inventory)
    })

    useEffect(() => { refetch() }, [search])

    return (
        <div className="flex flex-col py-6 px-4 sm:px-6 lg:px-8 h-full">
            <InventoryNavigate
                label={"Inventory Procurement"}
                name={name} search={search}
                setSearch={setSearch}
                printable={printable}
                showErrors={showErrors}
                setShowErrors={setShowErrors}
            />
            <InventoryRecords
                refetch={refetch}
                data={data?.result || []}
                setprintable={setprintable}
                showErrors={showErrors}
            />
        </div>
    )
}

export default InventoryIndex