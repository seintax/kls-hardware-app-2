import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery } from "react-query"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import NotificationDelete from "../../../utilities/interface/notification/notification.delete"
import InventoryConvert from "./inventory.convert"
import InventoryNavigate from "./inventory.navigate"
import InventoryPrices from "./inventory.prices"
import { searchConversion } from "./inventory.services"

const InventoryRegistry = () => {
    const { handleNotification } = useNotificationContext()
    const { search, setSearch } = useClientContext()
    const name = 'Conversion'
    const [printable, setprintable] = useState([])
    const { data, isLoading, isError, refetch } = useQuery([`${name.toLowerCase()}-index`, search], async (e) => {
        return await searchConversion(e.queryKey[1].key, e.queryKey[1].all.conversion)
    })
    const [showConvert, setShowConvert] = useState(false)
    const [records, setrecords] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [showPrice, setShowPrice] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Product Name', stack: false, sort: 'name' },
            // { name: 'Supplier', stack: true, sort: 'supplier', size: 200 },
            { name: 'Converted', stack: true, sort: 'drno', size: 160 },
            // { name: 'Received/Cost', stack: true, sort: 'received', size: 130 },
            { name: 'Supply', stack: true, sort: 'stocks', size: 150 },
            { name: 'Price', stack: true, sort: 'price', size: 150 },
            // { name: 'Date', stack: true, sort: 'time', size: 130 },
            // { name: 'Vatable', stack: true, size: 50, position: "text-center" },
            // { name: 'Divisible', stack: true, size: 50, position: "text-center" },
            { name: 'Details', stack: true, size: 210, position: "text-center" },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    useEffect(() => { refetch() }, [search])

    const rowSelect = (item) => setCurrentRecord(item)

    const toggleDelete = (item) => {
        if (item?.stocks !== item?.convqty) {
            handleNotification({
                type: 'error',
                message: "Cannot delete record with existing transactions."
            })
            return
        }
        setCurrentRecord(item)
        setShowDelete(true)
    }

    const toggleEdit = (item) => {
        if (item?.stocks === 0) {
            handleNotification({
                type: 'error',
                message: "Cannot edit record with zero stocks."
            })
            return
        }
        if (item?.stocks !== item?.convqty) {
            handleNotification({
                type: 'error',
                message: "Cannot edit record with existing transactions."
            })
            return
        }
        setCurrentRecord(item)
        setShowConvert(true)
    }

    const togglePrice = (item) => {
        if (item?.stocks === 0) {
            handleNotification({
                type: 'error',
                message: "Cannot change price records with zero stocks."
            })
            return
        }
        setCurrentRecord(item)
        setShowPrice(true)
    }

    const handleDelete = async () => {
        if (currentRecord) {
            return await deleteInventory(currentRecord?.id)
        }
    }

    const timeDurationInHours = (beg, end) => {
        var diff = (end - beg) / 1000
        diff /= (60 * 60)
        return Math.abs(Math.round(diff))

    }

    const displayStatus = (item) => {
        let beg = new Date(item.drdate).getTime()
        let end = (new Date()).getTime()
        let diff = timeDurationInHours(beg, end)
        if (diff <= 48) {
            return (
                <div className="w-[60px]">
                    <span className="bg-yellow-500 text-white py-0.5 px-3 rounded-[5px] cursor-default hover:no-underline">New</span>
                </div>
            )
        }
        if (item.stocks <= 0) {
            return (
                <div className="w-[60px]">
                    <span className="bg-red-700 text-white py-0.5 px-3 rounded-[5px] cursor-default hover:no-underline">Out</span>
                </div>
            )
        }
        if (item.stocks <= 10) {
            return (
                <div className="w-[60px]">
                    <span className="bg-orange-400 text-white py-0.5 px-3 rounded-[5px] cursor-default hover:no-underline">Low</span>
                </div>
            )
        }
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => { }, label: displayStatus(item) },
            { type: 'button', trigger: () => togglePrice(item), label: 'Price' },
            // { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }
    // (cost * conv) / item
    const items = (item) => {
        return [
            // { value: `${item.name} ${item.details} ${item.convunit}` },
            {
                value: (
                    <>
                        <div>
                            {`${item.name} ${item.details} ${item.convunit}`}
                        </div>
                        <div className="text-[10px]">by: {item.supplier}</div>
                    </>
                )
            },
            // { value: item.supplier },
            // { value: `${item.itemqty} (${currencyFormat.format(item.cost * item.convqty)})` },
            {
                value: (
                    <>
                        <div>
                            {`${item.itemqty} units`}
                        </div>
                        <div className="text-[10px]">Value: {currencyFormat.format(item.cost * item.convqty)}</div>
                    </>
                )
            },
            {
                value: (
                    <>
                        <div className="flex-none">
                            {currencyFormat.format(item.stocks).replace(".00", "")} units
                        </div>
                        <div className="text-[10px]">Received: {item.convqty}</div>
                    </>
                )
            },
            {
                value: (
                    <>
                        <div>
                            {currencyFormat.format(item.price)}
                        </div>
                        <div className="text-[10px]">Cost: {currencyFormat.format(item.cost)}</div>
                    </>
                )
            },
            {
                value: (
                    <>
                        <div className="flex gap-2">
                            <span className="flex-none">Vatable: {item.vatable}</span>
                            {/* <span className="flex-none">Divisible: {item.isloose}</span> */}
                        </div>
                        <div className="text-[10px] flex gap-2">
                            <span className="flex-none">Converted on {moment(item.time).format("MM-DD-YYYY")}</span>
                        </div>
                    </>
                )
            },
            // { value: `${item.convqty} (${currencyFormat.format(item.cost)})` },
            // { value: item.stocks },
            // { value: currencyFormat.format(item.price) },
            // { value: moment(item.time).format("MM-DD-YYYY") },
            // { value: item.vatable },
            // { value: item.isloose },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }
    const print = (item) => {
        return [
            { value: `${item.name} ${item.details} ${item.convunit}` },
            { value: `${item.itemqty} unit(s) with total value of ${currencyFormat.format(item.cost * item.convqty)}` },
            { value: `(${moment(item.time).format("MM-DD-YYYY")}) ` },
            { value: `${item.convqty} (${currencyFormat.format(item.cost)})` },
            { value: item.stocks },
            { value: currencyFormat.format(item.price) },
            { value: item.vatable },
            { value: item.isloose },
            { value: "N/A" },
            { value: "N/A" },
        ]
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data?.result, sorted) : data?.result
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    ondoubleclick: () => rowSelect(item),
                    items: items(item)
                }
            }))
            setprintable(tempdata?.map((item, i) => {
                return {
                    key: item?.id,
                    ondoubleclick: () => rowSelect(item),
                    items: print(item)
                }
            }))
        }
    }, [data, sorted])

    return (
        <div className="flex flex-col py-6 px-4 sm:px-6 lg:px-8 h-full">
            <InventoryNavigate
                label="Inventory Conversion"
                name={name}
                search={search}
                setSearch={setSearch}
                printable={printable}
            />
            <DataRecords
                columns={columns}
                records={records}
                page={startpage}
                setPage={setstartpage}
                itemsperpage={itemsperpage}
                setsorted={setsorted}
                keeppagination={true}
            />
            <NotificationDelete
                name={`${currentRecord?.name} ${currentRecord?.details} ${currentRecord?.unit}`}
                show={showDelete}
                setshow={setShowDelete}
                handleDelete={handleDelete}
                refetch={refetch}
            />
            <InventoryPrices
                reference={currentRecord}
                show={showPrice}
                setshow={setShowPrice}
            />
            <InventoryConvert
                id={currentRecord.conv}
                show={showConvert}
                setshow={setShowConvert}
                reference={currentRecord}
            />
        </div>
    )
}

export default InventoryRegistry