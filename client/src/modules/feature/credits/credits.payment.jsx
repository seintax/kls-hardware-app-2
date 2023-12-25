import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import StaticLabel from "../../../utilities/interface/forminput/static.label"

const CreditsPayment = ({ values, settle, setsettle, payments, setpayments, change, setchange, method, setmethod, loading, currentShift, processPayment }) => {
    const { handleNotification } = useNotificationContext()
    const [entry, setentry] = useState({
        amount: "",
        refcode: "",
        refdate: moment(new Date()).format("YYYY-MM-DD"),
        initial: "",
        creditor: ""
    })

    const onCheckedChange = (e) => {
        setmethod(e.target.value)
        if (e.target.value === "WAIVE" || e.target.value === "BALANCE") {
            if (settle > 0) {
                setentry(prev => ({
                    ...prev,
                    amount: settle
                }))
            }
        }
        else {
            setentry(prev => ({
                ...prev,
                amount: ""
            }))
        }
    }

    const onChange = (e) => {
        const { name, value } = e.target
        setentry(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const clearPaymentEntry = () => {
        setentry({
            amount: "",
            refcode: "",
            refdate: moment(new Date()).format("YYYY-MM-DD"),
            initial: "",
            creditor: ""
        })
    }

    const addPaymentMethod = () => {
        if (settle === 0) {
            handleNotification({
                type: 'error',
                message: `You have 0.00 amount to settle.`,
            })
            return
        }
        if (method !== "CASH" && Number(entry.amount) > Number(settle.toFixed(2))) {
            handleNotification({
                type: 'error',
                message: `Amount must not be greater the required amount to settle.`,
            })
            return
        }
        if (Number(entry.amount) === 0) {
            handleNotification({
                type: 'error',
                message: `Please enter an amount`,
            })
            return
        }
        if (method === "CHEQUE" || method === "GCASH") {
            if (entry.refcode === "") {
                handleNotification({
                    type: 'error',
                    message: `Please enter a reference code`,
                })
                return
            }
            if (method === "CHEQUE" && moment(new Date()).format("MM-DD-YYYY") === moment(entry.refdate).format("MM-DD-YYYY")) {
                handleNotification({
                    type: 'error',
                    message: `Cheque date must not be the current date.`,
                })
                return
            }
        }
        if (method === "CASH") {
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: values.code,
                    type: "CREDIT",
                    payment: method,
                    method: method,
                    amount: entry.amount,
                    refcode: "NA",
                    refstat: "NOT APPLICABLE",
                    balance: "",
                    creditor: "",
                    shift: currentShift
                }
            ])
        }
        if (method === "CHEQUE") {
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: values.code,
                    type: "CREDIT",
                    payment: method,
                    method: method,
                    amount: entry.amount,
                    refcode: entry.refcode,
                    refdate: entry.refdate,
                    refstat: "UNCLAIMED",
                    balance: "",
                    creditor: "",
                    shift: currentShift
                }
            ])
        }
        if (method === "GCASH") {
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: values.code,
                    type: "CREDIT",
                    payment: method,
                    method: method,
                    amount: entry.amount,
                    refcode: entry.refcode,
                    refdate: entry.refdate,
                    refstat: "NOT APPLICABLE",
                    balance: "",
                    creditor: "",
                    shift: currentShift
                }
            ])
        }
        if (method === "WAIVE") {
            let waived = payments?.filter(f => f.method === "WAIVE")
            if (waived?.length > 0) {
                handleNotification({
                    type: 'error',
                    message: `You can only add a single instance of waived method.`,
                })
                return
            }
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: values.code,
                    type: "SETTLEMENT",
                    payment: method,
                    method: method,
                    amount: entry.amount,
                    refcode: "NA",
                    refstat: "NOT APPLICABLE",
                    balance: "",
                    creditor: "",
                    shift: currentShift
                }
            ])
        }
        if (method === "BALANCE") {
            let balance = payments?.filter(f => f.method === "BALANCE")
            if (balance?.length > 0) {
                handleNotification({
                    type: 'error',
                    message: `You can only add a single instance of balance method.`,
                })
                return
            }
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: values.code,
                    type: "SETTLEMENT",
                    payment: method,
                    method: method,
                    amount: entry.amount,
                    refcode: "NA",
                    refstat: "NOT APPLICABLE",
                    balance: "",
                    creditor: "",
                    shift: currentShift
                }
            ])
        }
        clearPaymentEntry()
    }

    const deletePayment = (pay) => {
        setpayments(payments?.filter(f => f.index !== pay.index))
        if (pay.method === "BALANCE" && method === "BALANCE") {
            setentry(prev => ({
                ...prev,
                amount: pay.amount
            }))
        }
    }

    useEffect(() => {
        if (payments) {
            let totalpayments = payments?.reduce((prev, curr) => prev + Number(curr.amount), 0)
            let hascash = payments?.filter(f => f.payment === "CASH")?.length > 0
            let hascredit = payments?.filter(f => f.payment === "CREDIT")?.length > 0
            let diff = amount(values?.balance) - amount(totalpayments)
            if (hascredit) {
                setsettle(0)
                setchange(0)
            }
            else {
                setsettle(diff < 0 && hascash ? 0 : amount(diff))
                setchange(diff < 0 && hascash ? Math.abs(amount(diff)) : 0)
            }
        }
    }, [payments])

    return (
        <>
            <div className="px-5 py-3 rounded-[5px] border border-2 border-blue-400 text-sm">
                <div className="flex gap-[10px] items-center justify-between">
                    <span>
                        Amount to Settle: {currencyFormat.format(settle)}
                    </span>
                    <span>Change: {currencyFormat.format(change)}</span>
                </div>
            </div>
            <div className="px-5 py-3 rounded-[5px] border border-2 border-blue-400 text-sm">
                {
                    (payments?.length) ? (
                        payments?.map((pay, index) => (
                            <div key={index} className="w-full flex gap-[20px] items-center py-3">
                                <div>{index + 1}.</div>
                                <div className="w-[60px]">[{pay.payment}]</div>
                                <div>{currencyFormat.format(Number(pay.amount).toFixed(2))}</div>
                                <div className={pay.payment === "CHEQUE" || pay.payment === "GCASH" ? "pl-10" : "hidden"}>
                                    {pay.refcode} {pay.payment === "GCASH" ? null : (
                                        <><span className="text-gray-400 px-1">|</span> {pay.refdate}</>
                                    )}
                                </div>
                                <TrashIcon className="h-5 w-5 text-red-600 ml-auto cursor-pointer" onClick={() => deletePayment(pay)} />
                            </div>
                        ))
                    ) : (
                        <div className="flex gap-[10px] items-center">
                            <ExclamationCircleIcon className="h-7 w-7 text-blue-400" />
                            No payment entry.
                        </div>
                    )
                }
            </div>
            <div className={`px-5 py-3 rounded-[5px] border border-2 border-blue-400 text-sm ${settle > 0 ? "hidden" : ""}`}>
                You have settle for the amount of ({payments?.filter(f => f.method !== "BALANCE" && f.method !== "WAIVE")?.reduce((prev, curr) => prev + Number(curr?.amount), 0)}) with a balance of ({payments?.filter(f => f.method === "BALANCE")?.reduce((prev, curr) => prev + Number(curr?.amount), 0)})
            </div>
            <div className="flex flex-col gap-[20px]">
                <div className="flex items-center gap-[20px] text-sm">
                    <StaticLabel label="Method" />
                    <div className="w-full flex text-sm gap-[20px] no-select">
                        <div className="flex items-left gap-[10px]">
                            <input
                                type="radio"
                                id="cash"
                                name="method"
                                value="CASH"
                                checked={method === "CASH"}
                                onChange={onCheckedChange}
                            />
                            <label htmlFor="cash" className="cursor-pointer">CASH</label>
                        </div>
                        <div className="flex items-left gap-[10px]">
                            <input
                                type="radio"
                                id="cheque"
                                name="method"
                                value="CHEQUE"
                                checked={method === "CHEQUE"}
                                onChange={onCheckedChange}
                            />
                            <label htmlFor="cheque" className="cursor-pointer">CHEQUE</label>
                        </div>
                        <div className="flex items-left gap-[10px]">
                            <input
                                type="radio"
                                id="gcash"
                                name="method"
                                value="GCASH"
                                checked={method === "GCASH"}
                                onChange={onCheckedChange}
                            />
                            <label htmlFor="gcash" className="cursor-pointer">GCASH</label>
                        </div>
                        <div className="flex items-left gap-[10px]">
                            <input
                                type="radio"
                                id="waive"
                                name="method"
                                value="WAIVE"
                                checked={method === "WAIVE"}
                                onChange={onCheckedChange}
                            />
                            <label htmlFor="waive" className="cursor-pointer">WAIVE</label>
                        </div>
                        <div className="flex items-left gap-[10px]">
                            <input
                                type="radio"
                                id="settle"
                                name="method"
                                value="BALANCE"
                                checked={method === "BALANCE"}
                                onChange={onCheckedChange}
                            />
                            <label htmlFor="settle" className="cursor-pointer">BALANCE</label>
                        </div>
                    </div>
                </div>
                <div className="w-full flex gap-[10px] text-sm">
                    <input
                        type="number"
                        name="amount"
                        className={`w-full`}
                        placeholder="Amount"
                        value={entry.amount}
                        onChange={onChange}
                    />
                    <input
                        type="text"
                        name="refcode"
                        className={`w-full ${method === "CASH" || method === "WAIVE" || method === "BALANCE" ? "hidden" : ""}`}
                        placeholder="Reference No."
                        value={entry.refcode}
                        onChange={onChange}
                    />
                    <input
                        type="date"
                        name="refdate"
                        className={`w-full ${method !== "CHEQUE" ? "hidden" : ""}`}
                        value={entry.refdate}
                        onChange={onChange}
                    />
                </div>
                <div className="flex justify-between w-full mt-1 text-sm mb-3">
                    <button
                        type="submit"
                        className="button-ctrl px-4 bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                        onClick={() => addPaymentMethod()}
                    >
                        Add Payment Method
                    </button>
                    <button
                        type="button"
                        className="button-ctrl px-4 bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        onClick={() => processPayment()}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Process Payment"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default CreditsPayment