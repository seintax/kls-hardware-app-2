import React, { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchRequestForStatus, updateRequest } from "../request/request.services"
import { OnViewer } from "../viewer/viewer.index"
import { fetchDispensingByTransaction, fetchRequestByProgress, fetchTransactionByCode, updateDispensingByRequest } from "./cashering.service"

const CasheringRequest = ({ show, toggle, setcart, vat, settrans, settransno, setreceipt }) => {
    const { handleNotification } = useNotificationContext()
    const { setloading } = useClientContext()
    const [data, setdata] = useState([])
    const [records, setrecords] = useState()
    const [status, setstatus] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Transaction', stack: false, sort: 'code' },
            { name: 'Total Amount', stack: true, sort: 'prevnet', size: 180 },
            { name: 'Return Amount', stack: true, sort: 'rtrnnet', size: 180 },
            { name: 'Remaining Net', stack: true, size: 180 },
            { name: 'Requested by', stack: true, sort: 'requestedby', size: 200 },
            { name: 'Status', stack: true, sort: 'status', size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 150 },
        ]
    }

    const rowSelect = () => { }

    const toggleCancel = async (record) => {
        if (window.confirm("Do you wish to cancel this return request?")) {
            let resTrn = await fetchDispensingByTransaction(record.code)
            if (resTrn?.result) {
                let cart = resTrn?.result
                let param = {
                    request: {
                        status: "CANCELLED",
                        id: record.id
                    },
                    dispense: cart?.map(item => {
                        return {
                            toreturn: 0,
                            id: item.id
                        }
                    })
                }
                setloading(true)
                let resReq = await updateRequest(param.request)
                let resDis = await updateDispensingByRequest({ cart: param.dispense })
                setloading(false)
                if (resReq.success && resDis.success) {
                    getData(["APPROVED"])
                    handleNotification({
                        type: 'success',
                        message: `Return request for transaction no. ${record.code} has been cancelled`,
                    })
                }
            }
        }
    }

    const toggleOpen = async (item) => {
        let trn = await fetchTransactionByCode(item.code)
        if (trn?.result) {
            let trns = trn?.result
            let res = await fetchDispensingByTransaction(trns.code)
            let req = await fetchRequestByProgress(trns.code, status)
            let trndiscount = trns.less
            let resdiscount = res?.result?.reduce((prev, curr) => prev + Number(curr.less), 0)
            let drvdiscount = res?.result?.reduce((prev, curr) => prev + (Number(curr.less) * Number(curr.dispense)), 0)
            let imbadiscount = (trndiscount !== resdiscount)
            let calcdiscount = (trndiscount === drvdiscount)
            if (res?.result) {
                let logged = res?.result?.map(cart => {
                    let tax = (cart?.vatable === "Y" ? vat : 0)
                    let unit = cart?.price - (cart?.price * tax)
                    let rate = cart?.discount ? (cart?.discount / 100) : 1
                    let less = cart?.less ? ((cart?.toreturn * cart?.price) * (rate)) : 0
                    if (imbadiscount && calcdiscount) {
                        less = cart?.less ? Number(cart?.less) * Number(cart?.dispense) : 0
                    }
                    return {
                        ...cart,
                        acquisition: cart?.conv ? "CONVERSION" : "PROCUREMENT",
                        less: (imbadiscount && calcdiscount) ? less : cart?.less,
                        input: {
                            product: `${cart?.name} ${cart?.details} ${cart?.unit}`,
                            qty: cart?.dispense,
                            unit: unit,
                            vat: cart?.dispense * (cart?.price * tax),
                            price: cart?.dispense * cart?.price,
                            net: (cart?.dispense * cart?.price)
                        },
                        return: cart?.toreturn > 0 ? {
                            qty: cart?.toreturn,
                            unit: cart?.unit,
                            vat: cart?.toreturn * (cart?.price * cart?.taxrated),
                            price: cart?.toreturn * cart?.price,
                            less: less || 0,
                            net: (cart?.toreturn * cart?.price) - less
                        } : undefined,
                        returns: cart?.returned > 0 ? {
                            net: ((cart?.returned * cart?.price) - less) || 0
                        } : undefined
                    }
                })
                setcart(logged)
                settrans(trns.status)
                settransno(trns)
                setreceipt(prev => ({
                    ...prev,
                    applieddiscount: trns.discount,
                    discountedcarts: res?.result?.filter(f => Number(f.less) > 0).length || 0,
                    returnstatus: req?.result?.status === "CANCELLED" || req?.result?.status === "COMPLETED" || req?.result?.status === "DISAPPROVED" ? undefined : req?.result?.status,
                    requestid: req?.result?.id,
                    returntotal: logged?.reduce((prev, curr) => prev + Number(curr?.returned || 0), 0),
                    returnvalue: logged?.reduce((prev, curr) => prev + Number(curr?.returns?.net || 0), 0)
                }))
                toggle()
            }
        }
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleOpen(item), label: 'Open', hidden: item.status === "REQUESTING" || item.status === "CANCELLED" ? true : false },
            { type: 'button', trigger: () => toggleCancel(item), label: 'Cancel', hidden: item.status === "DISAPPROVED" || item.status === "CANCELLED" || item.status === "COMPLETED" ? true : false }
        ]
    }

    const items = (item) => {
        return [
            { value: <OnViewer id={item.code} /> },
            { value: currencyFormat.format(item.prevnet) },
            { value: currencyFormat.format(item.rtrnnet) },
            {
                value: <span className="text-blue-600">
                    {currencyFormat.format(Number(item.prevnet) - Number(item.rtrnnet))}
                </span>
            },
            { value: item.requestedby ? item.requestedby : "Administrator" },
            { value: item.status },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    ondoubleclick: () => rowSelect(item),
                    items: items(item)
                }
            }))
        }
    }, [data, sorted])

    const getData = async (arr) => {
        if (arr[0] === status) return
        setdata([])
        setloading(true)
        let res = await fetchRequestForStatus(arr)
        setstatus(arr[0])
        setdata(res?.result || [])
        setloading(false)
    }

    useEffect(() => {
        if (show) getData(["APPROVED"])
    }, [show])

    return (
        <AppModal show={show} setshow={toggle} title="Return Requests">
            <div className="w-[95vw] h-[85vh] flex flex-col py-3 font-bold">
                <div className="flex gap-[20px] text-sm pl-5">
                    <div className={`${status === "APPROVED" ? "text-gray-400" : "hover:underline cursor-pointer"}`} onClick={() => getData(["APPROVED"])}>
                        Approved
                    </div>
                    <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <div className={`${status === "REQUESTING" ? "text-gray-400" : "hover:underline cursor-pointer"}`} onClick={() => getData(["REQUESTING"])}>
                        Requesting
                    </div>
                    <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <div className={`${status === "DISAPPROVED" ? "text-gray-400" : "hover:underline cursor-pointer"}`} onClick={() => getData(["DISAPPROVED"])}>
                        Disapproved
                    </div>
                    <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <div className={`${status === "CANCELLED" ? "text-gray-400" : "hover:underline cursor-pointer"}`} onClick={() => getData(["CANCELLED"])}>
                        Cancelled
                    </div>
                    <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <div className={`${status === "COMPLETED" ? "text-gray-400" : "hover:underline cursor-pointer"}`} onClick={() => getData(["COMPLETED"])}>
                        Completed
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
            </div>
        </AppModal>
    )
}

export default CasheringRequest