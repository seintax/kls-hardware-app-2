import { ArrowLongDownIcon, ArrowLongUpIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link, useLocation, useParams } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { createInstance } from "../../../utilities/functions/datetime.functions"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import { generateZeros } from "../../../utilities/functions/string.functions"
import { fetchDispensingByInventory, fetchReturnByInventory } from "../cashering/cashering.service"
import { fetchTransportedByInventory } from "../transfer/transfer.services"
import { fetchAdjustmentByInventory, fetchConversionByInventory, fetchInventoryById, stocksInventory } from "./inventory.services"

const InventoryHistory = () => {
    const { handleNotification } = useNotificationContext()
    const location = useLocation()
    const { id } = useParams()
    const [instance, setinstance] = useState(createInstance())
    const { handleTrail, selected, renderSelected } = useClientContext()
    const [key, setkey] = useState("")
    const [data, setdata] = useState()
    const [disp, setdisp] = useState()
    const [trni, settrni] = useState()
    const [conv, setconv] = useState()
    const [rtrn, setrtrn] = useState()
    const [adjm, setadjm] = useState()
    const [totdisp, settotdisp] = useState(0)
    const [totconv, settotconv] = useState(0)
    const [tottrni, settottrni] = useState(0)
    const [totrtrn, settotrtrn] = useState(0)
    const [totadjm, settotadjm] = useState(0)

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    useEffect(() => {
        const instantiate = async () => {
            let res = await fetchInventoryById(id)
            setdata(res.result)
        }

        instantiate()
    }, [id, instance])

    useLayoutEffect(() => {
        setkey(renderSelected("/inventory", selected?.inventory?.key))
    }, [])

    useEffect(() => {
        if (data) {
            const getDispensing = async (id) => {
                let res = await fetchDispensingByInventory(id)
                setdisp(res.result)
                settotdisp(res.result?.reduce((prev, curr) => prev + amount(curr.dispense), 0))
            }
            const getTransported = async (id) => {
                let res = await fetchTransportedByInventory(id)
                settrni(res.result)
                settottrni(res.result?.reduce((prev, curr) => prev + amount(curr.qty), 0))
            }
            const getConverted = async (id) => {
                let res = await fetchConversionByInventory(id)
                setconv(res.result)
                settotconv(res.result?.reduce((prev, curr) => prev + amount(curr.itemqty), 0))
            }
            const getReturned = async (id) => {
                let res = await fetchReturnByInventory(id)
                setrtrn(res.result)
                settotrtrn(res.result?.reduce((prev, curr) => prev + amount(curr.qty), 0))
            }

            const getAdjustment = async (id) => {
                let res = await fetchAdjustmentByInventory(id)
                setadjm(res.result)
                settotadjm(res.result?.reduce((prev, curr) => curr.operator === "Plus" ? (prev + amount(curr.quantity)) : (prev - amount(curr.quantity)), 0))
            }

            getDispensing(data?.id)
            getTransported(data?.id)
            getConverted(data?.id)
            getReturned(data?.id)
            getAdjustment(data?.id)
        }
    }, [data, instance])

    const balanceStatus = (item) => {
        let balance = amount(item?.received) - (amount(item?.stocks) + amount(item?.soldtotal || 0) + amount(item?.trnitotal || 0) + amount(item?.convtotal || 0) - amount(item?.plusadjmt || 0) + amount(item?.mnusadjmt || 0))
        return balance
    }

    const updateStocks = async () => {
        let res = await stocksInventory(id)
        if (res.success) {
            setinstance(createInstance())
            handleNotification({
                type: "success",
                message: "Stocks updated"
            })
        }
    }

    return (
        <div className='flex flex-col py-6 px-4 sm:px-6 lg:px-8 h-full'>
            <div className="py-3">
                <div className="w-full flex justify-between mb-[-5px]">
                    <Link
                        to="/inventory"
                        className="button-static"
                    >
                        Back to Previous List
                    </Link>
                    <span className="font-semibold text-xl">
                        REF: {data?.id}
                    </span>
                </div>
            </div>
            <div className="flex flex-col no-select">
                <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                    ITEM: {key?.toUpperCase()}
                </h1>
                <div className="mt-2 text-sm text-gray-700 flex items-center gap-10">
                    <span>Received: {data?.received}</span>
                    <span>Cost: {currencyFormat.format(data?.cost)}</span>
                    <span>Stocks: {data?.stocks}</span>
                    <span>Price: {currencyFormat.format(data?.price)}</span>
                </div>
                <div className="mt-8 text-sm text-gray-700 flex items-center gap-2">
                    <span>Logged Values: </span>
                    <span className="text-white bg-orange-600 px-3 py-0.5 rounded-md">
                        Sold: {data?.soldtotal || 0}
                    </span>
                    <span className="text-white bg-blue-600 px-3 py-0.5 rounded-md">
                        Convert: {data?.convtotal || 0}
                    </span>
                    <span className="text-white bg-violet-600 px-3 py-0.5 rounded-md">
                        Transfer: {data?.trnitotal || 0}
                    </span>
                    {
                        (balanceStatus(data) !== 0) ? (
                            <span className="text-white bg-red-800 px-3 py-0.5 rounded-md flex items-center">
                                Irregular: {Math.abs(balanceStatus(data))}{balanceStatus(data) > 0 ?
                                    <ArrowLongUpIcon className="w-3 h-3 ml-[-2px]" /> :
                                    <ArrowLongDownIcon className="w-3 h-3 ml-[-2px]" />}
                            </span>
                        ) : (
                            <span className="text-white bg-green-600 px-3 py-0.5 rounded-md">
                                Balanced
                            </span>
                        )
                    }
                    <div className="ml-auto flex">
                        <button
                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-0.5 rounded-md"
                            onClick={() => updateStocks()}
                        >
                            Update Stocks
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex mt-2 shadow ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg w-full h-[40px] items-center bg-gray-200">
                <div className="w-full pl-3 py-2">Item Code</div>
                <div className="w-full pl-0 py-2">Transaction</div>
                <div className="w-full pl-3 py-2">Quantity</div>
                <div className="w-full pl-3 py-2">Details</div>
            </div>
            <div className="flex flex-col justify-between shadow ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg grow overflow-y-scroll">
                <div className="h-full">
                    <div className="flex items-center">
                        <div className="w-full pl-3 py-2 font-bold">Dispensed: {disp?.length ? "" : <span className="font-normal">No items dispensed.</span>}</div>
                    </div>
                    <div className={data?.soldtotal !== totdisp ? "w-full pl-3 text-red-700 text-sm" : "hidden"}>
                        Balance irregularity was caused by having a logged sold total of <b>{data?.soldtotal || 0}</b> while actual dispense record has <b>{totdisp}</b>.
                    </div>
                    {
                        disp?.map(d => (
                            <div key={`D-${d.item}-${d.id}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">{`D-${generateZeros(d.item, 6)}-${generateZeros(d.id, 8)}`}</div>
                                <div className="w-full pl-3 py-2">{d.code}</div>
                                <div className="w-full pl-10 py-2">{d.dispense}</div>
                                <div className="w-full pl-10 py-2"></div>
                            </div>
                        ))
                    }
                    <div className={`flex items-center ${totdisp > 0 ? "" : "hidden"}`}>
                        <div className="w-full pl-3 py-2"></div>
                        <div className="w-full pl-3 py-2 text-right font-bold">Total</div>
                        <div className="w-full pl-5">
                            <div className="py-2 pl-3 border-t-2 border-t-gray-400 w-[100px]">
                                {totdisp}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mt-2">
                        <div className="w-full pl-3 py-2 font-bold">Converted: {conv?.length ? "" : <span className="font-normal">No items converted.</span>}</div>
                    </div>
                    <div className={data?.convtotal !== totconv ? "w-full pl-3 text-red-700 text-sm" : "hidden"}>
                        Balance irregularity was caused by having a logged conversion total of <b>{data?.convtotal || 0}</b> while actual conversion record has <b>{totconv}</b>.
                    </div>
                    {
                        conv?.map(c => (
                            <div key={`D-${c.item}-${c.id}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">{`C-${generateZeros(c.item, 6)}-${generateZeros(c.id, 8)}`}</div>
                                <div className="w-full pl-3 py-2">{moment(c.time).format("YYYY-MM-DD hh:mm:ss A")}</div>
                                <div className="w-full pl-10 py-2">{c.itemqty}</div>
                            </div>
                        ))
                    }
                    <div className={`flex items-center ${totconv > 0 ? "" : "hidden"}`}>
                        <div className="w-full pl-3 py-2"></div>
                        <div className="w-full pl-3 py-2 text-right font-bold">Total</div>
                        <div className="w-full pl-5">
                            <div className="py-2 pl-3 border-t-2 border-t-gray-400 w-[100px]">
                                {totconv}
                            </div>
                        </div>
                        <div className="w-full pl-10 py-2"></div>
                    </div>
                    <div className="flex items-center mt-2">
                        <div className="w-full pl-3 py-2 font-bold">Transferred: {trni?.length ? "" : <span className="font-normal">No items transferred.</span>}</div>
                    </div>
                    <div className={data?.trnitotal !== tottrni ? "w-full pl-3 text-red-700 text-sm" : "hidden"}>
                        Balance irregularity was caused by having a logged transfer total of <b>{data?.trnitotal || 0}</b> while actual transferred record has <b>{tottrni}</b>.
                    </div>
                    {
                        trni?.map(t => (
                            <div key={`D-${t.item}-${t.id}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">{`T-${generateZeros(t.item, 6)}-${generateZeros(t.id, 8)}`}</div>
                                <div className="w-full pl-3 py-2">{moment(t.time).format("YYYY-MM-DD hh:mm:ss A")}</div>
                                <div className="w-full pl-10 py-2">{t.qty}</div>
                                <div className="w-full pl-10 py-2"></div>
                            </div>
                        ))
                    }
                    <div className={`flex items-center ${tottrni > 0 ? "" : "hidden"}`}>
                        <div className="w-full pl-3 py-2"></div>
                        <div className="w-full pl-3 py-2 text-right font-bold">Total</div>
                        <div className="w-full pl-5">
                            <div className="py-2 pl-3 border-t-2 border-t-gray-400 w-[100px]">
                                {tottrni}
                            </div>
                        </div>
                        <div className="w-full pl-10 py-2"></div>
                    </div>
                    <div className="flex items-center mt-2">
                        <div className="w-full pl-3 py-2 font-bold">Returned: {rtrn?.length ? "" : <span className="font-normal">No items returned.</span>}</div>
                    </div>
                    {
                        rtrn?.map(r => (
                            <div key={`D-${r.item}-${r.id}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">{`R-${generateZeros(r.item, 6)}-${generateZeros(r.id, 8)}`}</div>
                                <div className="w-full pl-3 py-2">{moment(r.time).format("YYYY-MM-DD hh:mm:ss A")}</div>
                                <div className="w-full pl-10 py-2">{r.qty}</div>
                                <div className="w-full pl-10 py-2"></div>
                            </div>
                        ))
                    }
                    <div className={`flex items-center ${totrtrn > 0 ? "" : "hidden"}`}>
                        <div className="w-full pl-3 py-2"></div>
                        <div className="w-full pl-3 py-2 text-right font-bold">Total</div>
                        <div className="w-full pl-5">
                            <div className="py-2 pl-3 border-t-2 border-t-gray-400 w-[100px]">
                                {totrtrn}
                            </div>
                        </div>
                        <div className="w-full pl-10 py-2"></div>
                    </div>
                    <div className="flex items-center mt-2">
                        <div className="w-full pl-3 py-2 font-bold">Adjusted: {adjm?.length ? "" : <span className="font-normal">No items adjusted.</span>}</div>
                    </div>
                    {
                        adjm?.map(r => (
                            <div key={`D-${r.item}-${r.id}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">{`A-${generateZeros(r.item, 6)}-${generateZeros(r.id, 8)}`}</div>
                                <div className="w-full pl-3 py-2">{moment(r.time).format("YYYY-MM-DD hh:mm:ss A")}</div>
                                <div className="w-full pl-10 py-2">
                                    {r.operator === "Plus" ? "+" : "-"}{r.quantity}
                                </div>
                                <div className="w-full pl-10 py-2 text-xs">{r.details}</div>
                            </div>
                        ))
                    }
                    <div className={`flex items-center ${adjm?.length ? "" : "hidden"}`}>
                        <div className="w-full pl-3 py-2"></div>
                        <div className="w-full pl-3 py-2 text-right font-bold">Total</div>
                        <div className="w-full pl-5">
                            <div className="py-2 pl-3 border-t-2 border-t-gray-400 w-[100px]">
                                {totadjm}
                            </div>
                        </div>
                        <div className="w-full pl-10 py-2"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InventoryHistory