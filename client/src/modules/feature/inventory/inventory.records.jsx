import { ExclamationTriangleIcon, PresentationChartLineIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import { generateZeros } from "../../../utilities/functions/string.functions"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from '../../../utilities/interface/notification/notification.delete'
import InventoryAdjust from "./inventory.adjust"
import InventoryConvert from "./inventory.convert"
import InventoryPrices from "./inventory.prices"
import { deleteInventory } from './inventory.services'

const InventoryRecords = ({ setter, manage, refetch, data, setprintable, showErrors }) => {
    const navigate = useNavigate()
    const { handleNotification } = useNotificationContext()
    const { setSelected } = useClientContext()
    const [showConvert, setShowConvert] = useState(false)
    const [records, setrecords] = useState()
    const [showAdjust, setShowAdjust] = useState(false)
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
            { name: '', stack: true, size: 50 },
            { name: 'Delivery', stack: true, sort: 'drno', size: 280 },
            { name: 'Supply', stack: true, sort: 'stocks', size: 130 },
            { name: 'Price', stack: true, sort: 'price', size: 130 },
            { name: 'Details', stack: true, size: 210 },
            { name: '', stack: false, screenreader: 'Action', size: 150 },
        ]
    }

    const rowSelect = (item) => setCurrentRecord(item)

    const toggleDelete = (item) => {
        if (item?.stocks !== item?.received) {
            handleNotification({
                type: 'error',
                message: "Cannot delete record with existing transactions."
            })
            return
        }
        setCurrentRecord(item)
        setShowDelete(true)
    }

    const toggleCovert = (item) => {
        if (item?.stocks === 0) {
            handleNotification({
                type: 'error',
                message: "Cannot convert record with zero stocks."
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
                message: "Cannot change price record with zero stocks."
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

    const balanceStatus = (item) => {
        let balance = amount(item.received) - (amount(item.stocks) + amount(item.soldtotal) + amount(item.trnitotal) + amount(item.convtotal) + amount(item.mnusadjmt) - amount(item.plusadjmt))
        if (balance !== 0) {
            return true
        }
        return false
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
        return (
            <div className="w-[60px]">
                <span className="bg-gray-200 text-white py-0.5 px-3 rounded-[5px] cursor-default hover:no-underline">Stk</span>
            </div>
        )
    }

    const toggleAdjust = (item) => {
        if (item.balanceStatus) {
            handleNotification({
                type: 'error',
                message: <div className="flex gap-1 items-center">Resolve <ExclamationTriangleIcon className="w-4 h-4 text-red-400" /> before adjusting.</div>
            })
            return
        }
        setCurrentRecord(item)
        setShowAdjust(true)
    }

    const actions = (item) => {
        return [
            // { type: 'button', trigger: () => { }, label: <ExclamationTriangleIcon className="w-4 h-4" />, hidden: !balanceStatus(item) },
            { type: 'button', trigger: () => { }, label: <ExclamationTriangleIcon className="w-4 h-4" />, hidden: !item.balanceStatus },
            { type: 'button', trigger: () => { }, label: displayStatus(item) },
            { type: 'button', trigger: () => toggleAdjust(item), label: 'Adjust' },
            { type: 'button', trigger: () => togglePrice(item), label: 'Price' },
            { type: 'button', trigger: () => toggleCovert(item), label: 'Convert' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const goToHistory = (item) => {
        setSelected(prev => ({
            ...prev,
            inventory: { id: item.id, key: `${item.name} ${item.details} ${item.unit}` }
        }))
        navigate(`/inventory/${item.id}/history`)
    }

    const goToLedger = (item) => {
        setSelected(prev => ({
            ...prev,
            inventory: { id: item.id, key: `${item.name} ${item.details} ${item.unit}` }
        }))
        navigate(`/inventory/${item.product}/ledger`)
    }

    const items = (item) => {
        return [
            {
                value:
                    <>
                        <div>
                            <span className="text-blue-700 hover:text-blue-800 cursor-pointer">{`${item.name}`}</span>
                        </div>
                        <div className="text-[10px]">
                            <b className="text-blue-700">{item.details}</b> {item.unit}
                        </div>
                    </>,
                onclick: () => goToHistory(item)
            },
            {
                value: <span>
                    <PresentationChartLineIcon className="h-5 w-5 cursor-pointer text-blue-700 hover:text-blue-800 no-select" />
                </span>,
                onclick: () => goToLedger(item)
            },
            {
                value: (
                    <>
                        <div>
                            {`${item.drno}-${moment(item.drdate).format("MM-DD-YYYY")}-${generateZeros(item.id, 6)}`}
                        </div>
                        <div className="text-[10px]">by: {item.supplier}</div>
                    </>
                )
            },
            {
                value: (
                    <>
                        <div className="flex-none">
                            {currencyFormat.format(item.stocks).replace(".00", "")} units
                        </div>
                        <div className="text-[10px]">Received: {item.received}</div>
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
                            <span className="flex-none">Vatable: {item.vatable === "Y" ? "Yes" : "No"}</span>
                        </div>
                        <div className="text-[10px] flex gap-2">
                            <span className="flex-none">Sold: {item.soldtotal}</span>
                            <span className="flex-none">Tran: {item.trnitotal}</span>
                            <span className="flex-none">Conv: {item.convtotal}</span>
                        </div>
                    </>
                )
            },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    const print = (item) => {
        return [
            { value: `${item.name} ${item.details} ${item.unit}` },
            { value: item.supplier },
            { value: `${item.drno}-${moment(item.drdate).format("MM-DD-YYYY")}-${generateZeros(item.id, 6)}` },
            { value: `${item.received} (${currencyFormat.format(item.cost)})` },
            { value: item.stocks },
            { value: currencyFormat.format(item.price) },
            { value: item.vatable },
            { value: item.isloose },
            { value: item.soldtotal },
            { value: item.trnitotal },
            { value: item.convtotal }
        ]
    }

    useEffect(() => {
        if (data) {
            let calcData = data?.map(item => {
                return {
                    ...item,
                    balanceStatus: balanceStatus(item)
                }
            })
            let filterData = showErrors ? calcData?.filter(f => f.balanceStatus) : calcData
            let tempdata = sorted ? sortBy(filterData, sorted) : filterData
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item?.id,
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
    }, [data, sorted, showErrors])

    return (
        <>
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
                show={showConvert}
                setshow={setShowConvert}
                reference={currentRecord}
            />
            <InventoryAdjust
                reference={currentRecord}
                show={showAdjust}
                setshow={setShowAdjust}
            />
        </>
    )
}
export default InventoryRecords