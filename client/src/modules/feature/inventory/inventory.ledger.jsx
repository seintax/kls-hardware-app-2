import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link, useLocation, useParams } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { createInstance } from "../../../utilities/functions/datetime.functions"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import { fetchDispensingByProductItem, fetchReturnByProduct } from "../cashering/cashering.service"
import { fetchTransportedByProduct } from "../transfer/transfer.services"
import { fetchConversionByProduct, fetchInventoryByProduct } from "./inventory.services"

const InventoryLedger = () => {
    const { handleNotification } = useNotificationContext()
    const location = useLocation()
    const { id } = useParams()
    const [instance, setinstance] = useState(createInstance())
    const { handleTrail, selected, renderSelected } = useClientContext()
    const [key, setkey] = useState("")
    const [data, setdata] = useState()
    const [dlvr, setdlvr] = useState()
    const [disp, setdisp] = useState()
    const [trni, settrni] = useState()
    const [conv, setconv] = useState()
    const [rtrn, setrtrn] = useState()
    const [totdisp, settotdisp] = useState(0)
    const [totconv, settotconv] = useState(0)
    const [tottrni, settottrni] = useState(0)
    const [totrtrn, settotrtrn] = useState(0)

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    // useEffect(() => {
    //     const instantiate = async () => {
    //         let res = await fetchInventoryById(id)
    //         setdata(res.result)
    //     }

    //     instantiate()
    // }, [id, instance])

    useLayoutEffect(() => {
        setkey(renderSelected("/inventory", selected?.inventory?.key))
    }, [])

    useEffect(() => {
        if (id) {
            const getDelivery = async (id) => {
                let res = await fetchInventoryByProduct(id)
                setdlvr(res.result)
            }
            const getDispensingByItem = async (id) => {
                let res = await fetchDispensingByProductItem(id)
                setdisp(res.result)
            }
            const getConverted = async (id) => {
                let res = await fetchConversionByProduct(id)
                setconv(res.result)
            }
            const getTransported = async (id) => {
                let res = await fetchTransportedByProduct(id)
                settrni(res.result)
            }
            const getReturned = async (id) => {
                let res = await fetchReturnByProduct(id)
                setrtrn(res.result)
            }

            getDelivery(id)
            getDispensingByItem(id)
            getConverted(id)
            getTransported(id)
            getReturned(id)
            // getConverted(data?.id)
        }
    }, [id, instance])

    const balanceStatus = (item) => {
        let balance = amount(item?.received) - (amount(item?.stocks) + amount(item?.soldtotal || 0) + amount(item?.trnitotal || 0) + amount(item?.convtotal || 0))
        return balance
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
                </div>
            </div>
            <div className="flex flex-col no-select">
                <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                    PRODUCT: {key?.toUpperCase()}
                </h1>
            </div>
            <div className="flex mt-2 shadow ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg w-full h-[40px] items-center bg-gray-200">
                <div className="w-full pl-3 py-2">Description</div>
                <div className="w-full pl-3 py-2">Quantity</div>
            </div>
            <div className="flex flex-col justify-between shadow ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg grow overflow-y-scroll">
                <div className="h-full">
                    <div className="flex items-center">
                        <div className="w-full pl-3 py-2 font-bold">Delivery: {dlvr?.length ? "" : <span className="font-normal">No items dispensed.</span>}</div>
                    </div>
                    {
                        dlvr?.map(i => (
                            <div key={`I-${i.product}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">
                                    Total Delivery:
                                </div>
                                <div className="w-full pl-5 py-2">{currencyFormat.format(i.total)}</div>
                            </div>
                        ))
                    }
                    <div className="flex items-center">
                        <div className="w-full pl-3 py-2 font-bold">Dispensed: {disp?.length ? "" : <span className="font-normal">No items dispensed.</span>}</div>
                    </div>
                    {
                        disp?.map(d => (
                            <div key={`D-${d.product}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">
                                    Total Dispensed:
                                </div>
                                <div className="w-full pl-5 py-2">{currencyFormat.format(d.total)}</div>
                            </div>
                        ))
                    }
                    <div className="flex items-center mt-2">
                        <div className="w-full pl-3 py-2 font-bold">Converted: {conv?.length ? "" : <span className="font-normal">No items converted.</span>}</div>
                    </div>
                    {
                        conv?.map(c => (
                            <div key={`C-${c.product}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">
                                    Total Converted:
                                </div>
                                <div className="w-full pl-5 py-2">{currencyFormat.format(c.total)}</div>
                            </div>
                        ))
                    }
                    <div className="flex items-center mt-2">
                        <div className="w-full pl-3 py-2 font-bold">Transferred: {trni?.length ? "" : <span className="font-normal">No items transferred.</span>}</div>
                    </div>
                    {
                        trni?.map(t => (
                            <div key={`T-${t.product}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">
                                    Total Transferred:
                                </div>
                                <div className="w-full pl-5 py-2">{currencyFormat.format(t.total)}</div>
                            </div>
                        ))
                    }
                    <div className="flex items-center mt-2">
                        <div className="w-full pl-3 py-2 font-bold">Returned: {rtrn?.length ? "" : <span className="font-normal">No items returned.</span>}</div>
                    </div>
                    {
                        rtrn?.map(r => (
                            <div key={`R-${r.item}-${r.id}`} className="flex items-center hover:bg-yellow-200">
                                <div className="w-full pl-3 py-2">
                                    Total Returned:
                                </div>
                                <div className="w-full pl-5 py-2">{currencyFormat.format(r.total)}</div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InventoryLedger