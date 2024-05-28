import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { balanceCustomer, libraryCustomer } from "../../library/customer/customer.services"
import { batchConversion, batchInventory } from "../inventory/inventory.services"
import { batchDispensing, batchPayment, createCredits, updateTransaction } from "./cashering.service"

const CasheringPayment = ({ show, toggle, cart, transno, shiftno, settrans, receipt }) => {
    const { handleNotification } = useNotificationContext()
    const { loading, setloading } = useClientContext()
    const [creditors, setcreditors] = useState([])
    const [payments, setpayments] = useState([])
    const [settle, setsettle] = useState(0)
    const [change, setchange] = useState(0)
    const [method, setmethod] = useState("CASH")
    const [entry, setentry] = useState({
        amount: "",
        refcode: "",
        refdate: moment(new Date()).format("YYYY-MM-DD"),
        initial: "",
        creditor: ""
    })

    const onChange = (e) => {
        const { name, value } = e.target
        setentry(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onCheckedChange = (e) => {
        setmethod(e.target.value)
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

    const addPaymentMethod = (e) => {
        e.preventDefault()
        if (method === "CASH") {
            if (payments?.filter(f => f.method === "CASH").length) {
                handleNotification({
                    type: 'error',
                    message: `You cannot have multiple payment methods for CASH.`,
                })
                return
            }
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: transno.code,
                    type: "SALES",
                    payment: method,
                    method: method,
                    amount: amount(entry.amount),
                    refcode: "NA",
                    refstat: "NOT APPLICABLE",
                    balance: "",
                    creditor: "",
                    shift: shiftno
                }
            ])
        }
        if (method === "CHEQUE") {
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: transno.code,
                    type: "SALES",
                    payment: method,
                    method: method,
                    amount: amount(entry.amount),
                    refcode: entry.refcode,
                    refdate: entry.refdate,
                    refstat: "UNCLAIMED",
                    balance: "",
                    creditor: "",
                    shift: shiftno
                }
            ])
        }
        if (method === "GCASH") {
            setpayments(prev => [
                ...prev,
                {
                    index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                    code: transno.code,
                    type: "SALES",
                    payment: method,
                    method: method,
                    amount: amount(entry.amount),
                    refcode: entry.refcode,
                    refdate: entry.refdate,
                    refstat: "NOT APPLICABLE",
                    balance: "",
                    creditor: "",
                    shift: shiftno
                }
            ])
        }
        if (method === "CREDIT") {
            if (payments?.length) {
                if (!window.confirm("Credit method cannot be in processed as multiple mode of payment. Existing payments will be removed. Do you wish to proceed?")) {
                    return
                }
            }
            if (!entry.creditor) {
                handleNotification({
                    type: 'error',
                    message: `Customer reference is required.`,
                })
                return
            }
            setpayments([{
                index: moment(new Date()).format("YYYY-MM-DD-HH-mm-SS"),
                code: transno.code,
                type: "CREDIT",
                payment: method,
                method: "CASH",
                amount: amount(entry.initial),
                refcode: "NA",
                refstat: "NOT APPLICABLE",
                balance: amount(receipt.netamount) - amount(entry.initial),
                creditor: entry.creditor,
                shift: shiftno
            }])
        }
        clearPaymentEntry()
    }

    useEffect(() => {
        if (show) {
            setpayments([])
            setmethod("CASH")
            const instantiate = async () => {
                setcreditors(await libraryCustomer())
            }
            instantiate()
        }
    }, [show])

    useEffect(() => {
        if (payments) {
            let totalpayments = payments?.reduce((prev, curr) => prev + amount(curr.amount), 0)
            let hascash = payments?.filter(f => f.payment === "CASH")?.length > 0
            let hascredit = payments?.filter(f => f.payment === "CREDIT")?.length > 0
            let diff = amount(receipt.netamount) - amount(totalpayments)
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

    const deletePayment = (pay) => {
        setpayments(payments?.filter(f => f.index !== pay.index))
    }

    const regularPayments = async () => {
        setloading(true)
        let cash = payments?.filter(f => f.payment === "CASH")
        let param = {
            vat: receipt.totalvat,
            total: receipt.totalprice,
            less: receipt.totaldiscount,
            net: receipt.netamount,
            discount: receipt.applieddiscount,
            tended: cash?.reduce((prev, curr) => prev + amount(curr.amount), 0),
            loose: amount(change),
            method: "SALES",
            status: "COMPLETED",
            id: transno.id
        }
        let modifiedpayments = payments
        if (change > 0) {
            modifiedpayments = payments?.map(pay => {
                if (pay.method === "CASH") {
                    return {
                        ...pay,
                        amount: amount(pay.amount) - amount(change)
                    }
                }
                return pay
            })
        }
        let inv = cart?.filter(f => f.acquisition === "PROCUREMENT")
        let cnv = cart?.filter(f => f.acquisition === "CONVERSION")
        let resDispg = await batchDispensing({ cart: cart })
        let resPaymt = await batchPayment({ payments: modifiedpayments })
        let resInvty = await batchInventory({ cart: inv, op: "minus" })
        let resConvs = await batchConversion({ cart: cnv, op: "minus" })
        let resTrans = await updateTransaction(param)
        setloading(false)
        if (resTrans.success && resDispg.success && resPaymt.success && resInvty.success && resConvs.success) {
            handleNotification({
                type: 'success',
                message: `Payment has been processed for transaction no. ${transno.code}.`,
            })
            settrans("COMPLETED")
            toggle()
        }
    }

    const creditPayment = async () => {
        let noncredit = payments?.filter(f => f.payment !== "CREDIT")?.length > 0
        if (noncredit) {
            handleNotification({
                type: 'error',
                message: "Cannot process this payment with credit and other types of payment method.",
            })
            return
        }
        setloading(true)
        let credit = payments[0]
        let param = {
            transaction: {
                vat: receipt.totalvat,
                total: receipt.totalprice,
                less: receipt.totaldiscount,
                net: receipt.netamount,
                discount: receipt.applieddiscount,
                tended: credit.amount,
                loose: change,
                method: "CREDIT",
                status: "COMPLETED",
                id: transno.id
            },
            credits: {
                customer: credit.creditor,
                code: credit.code,
                total: receipt.netamount,
                partial: credit.amount,
                balance: credit.balance
            }
        }
        let inv = cart?.filter(f => f.acquisition === "PROCUREMENT")
        let cnv = cart?.filter(f => f.acquisition === "CONVERSION")
        let resTrans = await updateTransaction(param.transaction)
        let resDispg = await batchDispensing({ cart: cart })
        let resCredt = await createCredits(param.credits)
        if (Number(credit.amount) > 0) {
            await batchPayment({ payments: payments })
        }
        let resInvty = await batchInventory({ cart: inv, op: "minus" })
        let resConvs = await batchConversion({ cart: cnv, op: "minus" })
        let resBlnce = await balanceCustomer({ id: credit.creditor })
        setloading(false)
        if (resTrans.success && resDispg.success && resCredt.success && resInvty.success && resConvs.success && resBlnce.success) {
            handleNotification({
                type: 'success',
                message: `Credit has been processed for transaction no. ${transno.code}`,
            })
            settrans("COMPLETED")
            toggle()
        }
    }

    const processPayment = async () => {
        let hascredit = payments?.filter(f => f.payment === "CREDIT")?.length > 0
        if (hascredit) {
            await creditPayment()
            return
        }
        await regularPayments()
    }

    const getCreditor = (id) => {
        let creditor = creditors?.filter(c => c.value.toString() === id.toString())
        if (creditor.length === 1) return creditor[0]
        return undefined
    }

    return (
        <AppModal show={show} setshow={toggle} title="Payment Transaction">
            <div className="w-[600px] flex flex-col py-3 gap-[20px] no-select">
                <div className="px-5 py-3 rounded-[5px] border border-2 border-blue-400 text-sm">
                    <div className="flex gap-[10px] items-center justify-between">
                        <span>Amount to Settle: {currencyFormat.format(settle)}</span>
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
                                    <div>{currencyFormat.format(amount(pay.amount))}</div>
                                    <div className={pay.payment === "CHEQUE" || pay.payment === "GCASH" ? "pl-10" : "hidden"}>
                                        {pay.refcode} <span className="text-gray-400 px-1">|</span> {pay.refdate}
                                    </div>
                                    <div className={pay.payment === "CREDIT" ? "pl-10" : "hidden"}>
                                        {getCreditor(pay.creditor)?.data?.name}'s Credit: {currencyFormat.format(Number(pay.balance).toFixed(2))}
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
                <form className="flex flex-col gap-[20px]" onSubmit={addPaymentMethod}>
                    <div className="w-full flex text-sm justify-around px-10">
                        <div className="flex items-center gap-[10px]">
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
                        <div className="flex items-center gap-[10px]">
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
                        <div className="flex items-center gap-[10px]">
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
                        <div className="flex items-center gap-[10px]">
                            <input
                                type="radio"
                                id="credit"
                                name="method"
                                value="CREDIT"
                                checked={method === "CREDIT"}
                                onChange={onCheckedChange}
                            />
                            <label htmlFor="credit" className="cursor-pointer">CREDIT</label>
                        </div>
                    </div>
                    <div className="w-full flex gap-[10px] text-sm">
                        <input
                            type="number"
                            name="amount"
                            className={`w-full ${method === "CREDIT" ? "hidden" : ""}`}
                            placeholder="Amount"
                            value={entry.amount}
                            onChange={onChange}
                            required={method !== "CREDIT"}
                        />
                        <input
                            type="number"
                            name="initial"
                            className={`w-full ${method !== "CREDIT" ? "hidden" : ""}`}
                            placeholder="Partial Payment"
                            value={entry.initial}
                            onChange={onChange}
                            required={method === "CREDIT"}
                        />
                        <input
                            type="text"
                            name="refcode"
                            className={`w-full ${method === "CASH" || method === "CREDIT" ? "hidden" : ""}`}
                            placeholder="Reference No."
                            value={entry.refcode}
                            onChange={onChange}
                            required={method === "CHEQUE" || method === "GCASH"}
                        />
                        <input
                            type="date"
                            name="refdate"
                            className={`w-full ${method !== "CHEQUE" ? "hidden" : ""}`}
                            value={entry.refdate}
                            onChange={onChange}
                            required={method === "CHEQUE"}
                        />
                        <select
                            name="creditor"
                            className={`w-full ${method !== "CREDIT" ? "hidden" : ""}`}
                            value={entry.creditor}
                            onChange={onChange}
                            required={method === "CREDIT"}
                        >
                            <option value="" disabled>Select a creditor</option>
                            {
                                creditors.map((creditor, index) => (
                                    <option key={index} value={creditor.value}>
                                        {creditor.key}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex justify-between w-full mt-1 text-sm">
                        <button
                            type="submit"
                            className="button-ctrl px-4 bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                            disabled={payments?.filter(f => f.payment === "CREDIT")?.length}
                        >
                            Add Payment Method
                        </button>
                        <button
                            type="button"
                            className="button-ctrl px-4"
                            disabled={settle !== 0 || loading}
                            onClick={() => processPayment()}
                        >
                            {loading ? "Processing..." : "Process Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </AppModal >
    )
}

export default CasheringPayment