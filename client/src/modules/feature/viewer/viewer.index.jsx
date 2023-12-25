import { LinkIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from "react-query"
import { useLocation, useParams } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { createInstance } from "../../../utilities/functions/datetime.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import { fetchCustomerById } from "../../library/customer/customer.services"
import { fetchTransactionByCode } from "../cashering/cashering.service"
import ViewerSectionCredits from "./viewer.section.credits"
import ViewerSectionDispense from "./viewer.section.dispense"
import ViewerSectionPayment from "./viewer.section.payment"
import ViewerSectionReimburse from "./viewer.section.reimburse"
import ViewerSectionRequest from "./viewer.section.request"
import ViewerSectionReturns from "./viewer.section.returns"

export const OnViewer = ({ id }) => {
    const { handleNotification } = useNotificationContext()

    const openTransaction = () => {
        if (window.confirm(`Viewer for Transaction No. ${id} will show in a new tab.\nDo you wish to proceed?`)) {
            window.open(`/#/viewer/${id}`, '_blank')
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(id)
        handleNotification({
            type: 'clipboard',
            message: "Transaction code has been copied."
        })
    }

    return (
        <div className="w-fit flex items-center w-fit gap-1">
            <span className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
                onDoubleClick={() => copyToClipboard()}>
                {id}
            </span>
            <span
                className="cursor-pointer p-1 rounded-md hover:bg-gray-400"
                onClick={() => openTransaction()}
            >
                <MagnifyingGlassIcon className="w-4 h-4" />
            </span>
        </div>
    )
}

export const OnClipper = ({ id }) => {
    const { handleNotification } = useNotificationContext()

    const copyToClipboard = () => {
        navigator.clipboard.writeText(id)
        handleNotification({
            type: 'clipboard',
            message: "Transaction code has been copied."
        })
    }

    return (
        <div className="w-fit flex items-center w-fit gap-1">
            <span
                className="hover:underline cursor-pointer"
                onDoubleClick={() => copyToClipboard()}>
                {id}
            </span>
        </div>
    )
}

const DataValue = ({ children, label, trueval }) => {
    return (
        <div className={`px-3 w-full h-[50px] shadow-md cursor-pointer flex flex-col justify-center gap-1 items-start no-select ${trueval ? "bg-green-300 hover:bg-gradient-to-b hover:from-green-200 hover:to-green-300 border-2 border-green-300" : "bg-gray-300 hover:bg-gradient-to-b hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300"}`}>
            <label htmlFor="" className={`text-[11px] font-normal ${label ? "" : "hidden"}`}>{label}</label>
            <span className="ml-3">{children}</span>
        </div>
    )
}

const DynamicValue = ({ children, label, trueval, func }) => {
    return (
        <div className={`px-3 w-full h-[50px] shadow-md cursor-pointer flex flex-col justify-center gap-1 items-start no-select ${trueval ? "bg-green-300 hover:bg-gradient-to-b hover:from-green-200 hover:to-green-300 border-2 border-green-300" : "bg-gray-300 hover:bg-gradient-to-b hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300"}`}>
            <div className={`w-full text-[11px] font-normal flex justify-between ${label ? "" : "hidden"}`}>
                <span>{label}</span>
                <span>{func ? <b>&#x192;unc</b> : ""}</span>
            </div>
            <span className="ml-3">{children}</span>
        </div>
    )
}

export const BaseForm = ({ data }) => {
    const [baseinput, setbaseinput] = useState("")

    const onChange = (e) => {
        setbaseinput(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (data?.baseupdate) {
            if (window.confirm(`Do you wish to set base value for [${data?.base}]?`)) {
                await data?.baseupdate(baseinput)
            }
        }
    }

    return (
        <form onSubmit={onSubmit} className={`flex gap-3 text-xs font-normal`}>
            <input type="number" min="0.00" step="0.001" onChange={onChange} value={baseinput} required placeholder="Base Value" className="w-full text-xs" />
            <button type="submit" className="button-link flex-none">Set as base</button>
        </form>
    )
}

export const OnField = ({ upper, lower, data, summary }) => {
    const { handleNotification } = useNotificationContext()
    const { user } = useClientContext()

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        handleNotification({
            type: 'clipboard',
            message: "Information has been copied."
        })
    }

    const activateTrigger = () => {
        if (data?.trigger) data?.trigger(
            <div className="flex flex-col gap-3 w-full">
                <div className="flex justify-between">
                    <span>{data?.title}</span>
                    <span>Acceptable Scenarios: {data?.valid}</span>
                </div>
                <DataValue>
                    {data?.heading}
                </DataValue>
                {data?.scenario?.map((scene, index) => (
                    <div key={index} onClick={() => scene?.apply && user?.name === "DEVELOPER" ? scene?.apply(scene?.trueval) : () => { }}>
                        <DynamicValue
                            label={`${scene?.index}. ${scene?.label}`}
                            trueval={scene?.trueval}
                            func={scene?.apply}
                        >
                            {scene?.display}
                        </DynamicValue>
                    </div>
                ))}
                {
                    // indentifyProblematic() && data?.baseupdate ? (
                    //     <BaseForm data={data} />
                    // ) : null
                    data?.baseupdate ? (
                        <BaseForm data={data} />
                    ) : null
                }
            </div>
        )
    }

    const indentifyProblematic = () => {
        if (!data?.scenario) return false
        let valid = data?.scenario?.filter(f => f.trueval)?.map(scene => { return scene.index }).join("")
        var basis = data?.valid.split("")
        let loop = basis?.reduce((prev, curr) => prev * (Number(valid.includes(curr))), 1)
        return !Boolean(loop)
    }

    return (
        <div key={Math.random() * 100000} className={`w-full flex flex-col no-select rounded-md ${summary ? "" : indentifyProblematic() ? "bg-gradient-to-r from-white to-red-300" : ""} ${data?.scenario ? "cursor-pointer hover:bg-gradient-to-r hover:from-white hover:to-blue-200" : ""}`} onClick={() => activateTrigger()}>
            <span className="text-sm" onDoubleClick={() => copyToClipboard(upper)}>{upper}</span>
            <span className="text-[11px] text-gray-500" onDoubleClick={() => copyToClipboard(lower)}>
                {lower}
            </span>
        </div>
    )
}

const ViewerIndex = () => {
    const { handleNotification } = useNotificationContext()
    const queryClient = useQueryClient()
    const location = useLocation()
    const { id } = useParams()
    const { handleTrail } = useClientContext()
    const [instance, setinstance] = useState(createInstance())
    const { data, isLoading, isError, refetch } = useQuery([`getTransactionById`, id, instance], () => fetchTransactionByCode(id))
    const [info, setinfo] = useState()
    const [creditor, setcreditor] = useState()
    const [customer, setcustomer] = useState()

    const getCustomerById = useQuery({
        queryKey: ["getCustomerById", creditor, instance],
        queryFn: async (e) => await fetchCustomerById(e.queryKey[1]),
        enabled: !!creditor
    })

    const refetchTransaction = () => {
        queryClient.invalidateQueries(["getTransactionById", id, instance])
        setinstance(createInstance())
        refetch()
    }

    useEffect(() => {
        handleTrail(location?.pathname.replace("/viewer", ""))
        document.title = id
    }, [location])

    useEffect(() => {
        if (data?.result?.id) setinfo(data?.result)
    }, [data])

    const determineSource = (info) => {
        let date1 = new Date(info?.code.split("-")[0]).getTime()
        let date2 = new Date("20230601").getTime()
        return date1 >= date2 ? "NEW" : "OLD"
    }

    const copyURLToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        handleNotification({
            type: 'clipboard',
            message: "URL has been copied."
        })
    }

    const copyQueryToClipboard = (table, tag) => {
        let sql = `SELECT * FROM ${table} WHERE ${tag}_trans='${id}'`
        navigator.clipboard.writeText(sql)
        handleNotification({
            type: 'clipboard',
            message: "Query has been copied."
        })
    }

    useEffect(() => {
        if (getCustomerById.isSuccess) {
            setcustomer(getCustomerById.data.result)
        }
    }, [getCustomerById.status])


    return (
        <div className="flex flex-col px-4 sm:px-6 lg:px-8 h-full gap-10 text-xs">
            <div className="w-full flex flex-col sm:flex-row gap-5 pb-5">
                <div className="w-full flex flex-col gap-5">
                    <div className="sm:flex sm:items-center bg-white py-4 z-20">
                        <div className="sm:flex-auto no-select">
                            <span className="text-sm text-gray-500">
                                Transaction No.
                            </span>
                            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                                {id}
                            </h1>
                        </div>
                        <div className="sm:flex-auto no-select ml-60">
                            <span className="text-sm text-gray-500">
                                Source
                            </span>
                            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                                {determineSource(info)}
                            </h1>
                        </div>
                        <div className="sm:flex-auto no-select">
                            <span className="text-sm text-gray-500">
                                Method
                            </span>
                            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                                {info?.method || "N/A"}
                            </h1>
                        </div>
                        <div className="sm:flex-auto no-select">
                            <span className="text-sm text-gray-500">
                                Status
                            </span>
                            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                                {info?.status}
                            </h1>
                        </div>
                        <div className="sm:flex-auto no-select">
                            <span className="text-sm text-gray-500">
                                Receipt No.
                            </span>
                            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                                {info?.ordno}
                            </h1>
                        </div>
                    </div>
                    <div className="w-[700px] lg:w-[1200px] min-h-full border border-1 border-gray-400 flex flex-col p-3 relative">
                        <div className="py-3 px-1 text-sm font-semibold flex gap-5 items-center justify-between cursor-pointer" onDoubleClick={() => copyQueryToClipboard("pos_sales_dispensing", "sale")}>
                            Dispensed Record: <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-auto max-h-[600px]">
                            <ViewerSectionDispense id={id} info={info} refetcher={refetchTransaction} />
                        </div>
                        <div className="py-3 px-1 text-sm font-semibold flex gap-5 items-center justify-between cursor-pointer" onDoubleClick={() => copyQueryToClipboard("pos_payment_collection", "paym")}>
                            Payment Record: <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-auto max-h-[600px]">
                            <ViewerSectionPayment id={id} info={info} refetcher={refetchTransaction} />
                        </div>
                        <div className="py-3 px-1 text-sm font-semibold flex gap-5 items-center justify-between cursor-pointer" onDoubleClick={() => copyQueryToClipboard("pos_return_transaction", "rtrn")}>
                            Request Record: <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-auto max-h-[600px]">
                            <ViewerSectionRequest id={id} />
                        </div>
                        <div className="py-3 px-1 text-sm font-semibold flex gap-5 items-center justify-between cursor-pointer" onDoubleClick={() => copyQueryToClipboard("pos_return_dispensing", "rsal")}>
                            Returns Record: <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-auto max-h-[600px]">
                            <ViewerSectionReturns id={id} />
                        </div>
                        <div className="py-3 px-1 text-sm font-semibold flex gap-5 items-center justify-between cursor-pointer" onDoubleClick={() => copyQueryToClipboard("pos_sales_credit", "cred")}>
                            Credits Record: <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-auto max-h-[600px]">
                            <ViewerSectionCredits id={id} info={info} refetcher={refetchTransaction} setcreditor={setcreditor} />
                        </div>
                        <div className="py-3 px-1 text-sm font-semibold flex gap-5 items-center justify-between cursor-pointer" onDoubleClick={() => copyQueryToClipboard("pos_return_reimbursement", "reim")}>
                            Reimbursed Record: <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-auto max-h-[600px]">
                            <ViewerSectionReimburse id={id} />
                        </div>
                    </div>
                </div>
                <div className="w-[300px] flex-none flex flex-col pt-14 gap-6 content-start">
                    <div>
                        <button className="rounded-md bg-gradient-to-b from-blue-500 to-blue-700 px-5 py-3 text-white hover:from-blue-600 hover:to-blue-800 flex gap-2" onClick={() => copyURLToClipboard()}>
                            <LinkIcon className="w-4 h-4" /> SHARE LINK
                        </button>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Total Purchase
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {currencyFormat.format(info?.total)}
                        </h1>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Total VAT
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {currencyFormat.format(info?.vat)}
                        </h1>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Total Discount
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {currencyFormat.format(info?.less)}
                        </h1>
                        <span className="text-md font-semibold text-gray-900">Rated with {info?.discount}%</span>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Total NET
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {currencyFormat.format(info?.net)}
                        </h1>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Tended
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {currencyFormat.format(info?.tended)}
                        </h1>
                        <span className="text-md font-semibold text-gray-900">
                            Change: {currencyFormat.format(info?.loose)}
                        </span>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Total Returns
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {currencyFormat.format(info?.returned)}
                        </h1>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Transaction Date
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {moment(info?.date).format("MMMM DD, YYYY")?.toUpperCase()}
                        </h1>
                        <span className="text-md font-semibold text-gray-900">Logged {moment(info?.time).format("MM-DD-YYYY hh:mm:ss A")?.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col no-select flex-none">
                        <span className="text-sm text-gray-500">
                            Customer
                        </span>
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                            {customer?.name ? customer?.name : "None"}
                        </h1>
                        {
                            customer?.name ? (
                                <span className="text-md font-semibold text-gray-900">Credit Value at {currencyFormat.format(customer?.value || 0)}</span>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewerIndex