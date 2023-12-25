import { PrinterIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useQuery } from "react-query"
import { Link, useLocation, useParams } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataError from "../../../utilities/interface/datastack/data.error"
import DataLoading from "../../../utilities/interface/datastack/data.loading"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from '../../../utilities/interface/notification/notification.delete'
import { deleteInventory, deliveryInventoryByRef } from "../inventory/inventory.services"
import DeliveryRegistryUnit from "./delivery.registry.unit"
import { balanceDelivery, fetchDeliveryById } from './delivery.services'

const DeliveryRegistry = () => {
    const location = useLocation()
    const { id } = useParams()
    const { handleTrail, selected, renderSelected } = useClientContext()
    const { data, isLoading, isError, refetch } = useQuery('delivery-item-index', () => deliveryInventoryByRef(id))
    const [records, setrecords] = useState()
    const [information, setinformation] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [showProduct, setShowProduct] = useState(false)
    const [currentRecord, setCurrentRecord] = useState()
    const [sorted, setsorted] = useState()
    const [key, setkey] = useState("")
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Product Name', stack: false, sort: 'name' },
            { name: 'Quantity', stack: true, sort: 'received', size: 150 },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 150 },
            { name: 'Cost', stack: true, sort: 'cost', size: 150 },
            { name: 'Value', stack: true, size: 150 },
            { name: 'Receipt Display', stack: true, sort: 'receipt', size: 180 },
            { name: '', stack: false, screenreader: 'Action', size: 100 },
        ]
    }

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    useEffect(() => {
        if (!showProduct && !currentRecord) {

        }
    }, [showProduct])

    const rowSelect = (record) => setCurrentRecord(record)

    const toggleDelete = (record) => {
        setCurrentRecord(record)
        setShowDelete(true)
    }

    const toggleEdit = (item) => {
        if (item.received !== item.stocks) {
            alert("Cannot edit items that has existing sales record.")
            return
        }
        setCurrentRecord(item)
        setShowProduct(true)
    }

    const toggleProduct = () => {
        setCurrentRecord()
        setShowProduct(true)
    }

    const handleDelete = async () => {
        if (currentRecord) {
            let res = await deleteInventory(currentRecord?.id)
            return await balanceDelivery({ id: information.id })
        }
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: `${item.name} ${item.details} ${item.unit}` },
            { value: item.received },
            { value: item.stocks },
            { value: currencyFormat.format(item.cost) },
            { value: currencyFormat.format(item.received * item.cost) },
            { value: item.receipt },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    const print = (item) => {
        return [
            { value: `${item.name} ${item.details} ${item.unit}` },
            { value: item.received },
            { value: currencyFormat.format(item.cost) },
            { value: currencyFormat.format(item.received * item.cost) },
            { value: item.receipt },
        ]
    }

    useEffect(() => {
        const instantiate = async () => {
            const info = await fetchDeliveryById(id)
            setinformation(info.result)
        }

        instantiate()
    }, [id])

    useEffect(() => {
        if (data?.result?.length) {
            let tempdata = sorted ? sortBy(data?.result, sorted) : data?.result
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    ondoubleclick: () => rowSelect(item),
                    items: items(item),
                    print: print(item)
                }
            }))
        }
        else setrecords([])
    }, [data, sorted])

    const printData = async () => {
        localStorage.setItem("delivery-received", JSON.stringify({
            title: "DELIVERY RECEIPT",
            subtext: key,
            data: records?.map(rec => {
                return {
                    items: rec.print
                }
            })
        }))
        window.open(`/#/print/delivery-received/${Math.random() * (100000000 - 1) + 1}`, '_blank')
    }

    useLayoutEffect(() => {
        const layout = () => {
            if (location.pathname.includes("suppliers")) {
                setkey(renderSelected("/suppliers", selected?.supplier?.display))
                return
            }
            setkey(renderSelected("/delivery", selected?.delivery?.key))
        }

        layout()
    }, [])

    return (
        <div className="p-6">
            <div className="w-full flex justify-between mb-[-5px]">
                <div className="flex gap-[20px] items-center">
                    <Link
                        to={location.pathname.includes("suppliers") ? `/suppliers/${selected?.supplier?.id}/view` : "/delivery"}
                        className="button-static"
                    >
                        Back to Previous List
                    </Link>
                    <span className="text-sm">
                        {location.pathname.includes("suppliers") ? "Supplier" : "DR No."}:
                        <b className="ml-3">
                            {key}
                        </b>
                    </span>
                </div>
                <div className="flex gap-[10px]">
                    <button className="button-link" onClick={() => printData()}>
                        <PrinterIcon className="w-5 h-5 text-white" />
                    </button>
                    <button className="button-link" onClick={() => toggleProduct()}>
                        Add product
                    </button>
                </div>
            </div>
            <DataRecords
                columns={columns}
                records={records}
                page={startpage}
                setPage={setstartpage}
                itemsperpage={itemsperpage}
                setsorted={setsorted}
            />
            {(isLoading && (<DataLoading />))}
            {(isError && (<DataError />))}
            <DeliveryRegistryUnit id={currentRecord?.id || undefined} reference={information} show={showProduct} setshow={setShowProduct} />
            <NotificationDelete
                name={currentRecord?.name}
                show={showDelete}
                setshow={setShowDelete}
                handleDelete={handleDelete}
                refetch={refetch}
            />
        </div >
    )
}
export default DeliveryRegistry