import { ArrowUturnUpIcon, ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { balanceCustomer } from "../../library/customer/customer.services"
import { fetchCreditsByOngoing, returnCredits } from "../credits/credits.services"
import { fetchPaymentByTransaction, returnPayment } from "./cashering.service"

const CasheringReimburse = ({ show, toggle, reimburse, setreimburse, reimbursement, transno, receipt, openTransaction }) => {
    const { handleNotification } = useNotificationContext()
    const { loading, setloading } = useClientContext()
    const [payments, setpayments] = useState([])
    const [consume, setconsume] = useState(0)
    const [credit, setcredit] = useState(0)
    const [applied, setapplied] = useState(0)
    const [showapply, setshowapply] = useState(false)
    const [value, setvalue] = useState("")
    const [currentpayment, setcurrentpayment] = useState()
    const [customer, setcustomer] = useState()

    const processReimbursement = async (e) => {
        e.preventDefault()
        if (amount(reimburse.amount) < amount(receipt?.returnnet)) {
            handleNotification({
                type: 'error',
                message: `Return amount provided is insufficient. ${currencyFormat.format(receipt?.returnnet)} has to be returned`,
            })
            return
        }
        if (consume > 0) {
            handleNotification({
                type: 'error',
                message: `Please consume the remaining amount of ${currencyFormat.format(consume)}`,
            })
            return
        }
        setloading(true)
        let status = await reimbursement()
        let paymentstatus = true
        if (payments.length) {
            let param = {
                payments: payments?.filter(f => amount(f.applied) > 0)?.map(pay => {
                    return {
                        reimburse: status.reimburse,
                        amount: amount(pay.amount) - amount(pay.applied),
                        id: pay.id
                    }
                })
            }
            let resPaym = await returnPayment(param)
            paymentstatus = resPaym.success
        }
        let methodstatus = true
        let customerstatus = true
        if (transno.method === "CREDIT") {
            let credits = {
                amt: amount(reimburse?.amount),
                rem: amount(credit) - amount(reimburse?.amount),
                code: transno.code,
            }
            let resCred = await returnCredits(credits)
            methodstatus = resCred.success
            let resBalance = await balanceCustomer({ id: customer })
            customerstatus = resBalance.success
        }
        setloading(false)
        if (status.success && paymentstatus && methodstatus && customerstatus) {
            let transaction = await openTransaction(transno)
            if (transaction) {
                handleNotification({
                    type: 'success',
                    message: "Return has been successfully commited.",
                })
            }
            toggle()
        }
    }

    const onChange = (e) => {
        if (!show) return
        const { name, value } = e.target
        setreimburse(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onAmountChange = (e) => {
        if (!showapply) return
        const { value } = e.target
        setvalue(value)
    }

    useEffect(() => {
        if (show) {
            const instantiate = async () => {
                setloading(false)
                setcustomer()
                let resCred = await fetchCreditsByOngoing(transno.code)
                if (resCred?.result?.length) setcustomer(resCred?.result[0]?.customer)
                let creditbalance = resCred?.result?.reduce((prev, curr) => prev + amount(curr.balance), 0) || 0
                setcredit(creditbalance)
                let resPaym = await fetchPaymentByTransaction(transno.code)
                setpayments(resPaym?.result.map(r => {
                    return {
                        ...r,
                        applied: 0
                    }
                }))
                let toconsume = receipt?.returnnet - creditbalance
                let consumption = toconsume > 0 ? toconsume : 0
                setreimburse({
                    method: consumption == 0 ? "NONE" : "CASH",
                    amount: currencyFormat.format(receipt?.returnnet),
                    credit: currencyFormat.format(creditbalance),
                    reference: ""
                })
                setconsume(consumption)
                setapplied(0)
            }
            instantiate()
        }
    }, [show])

    const toggleApply = (payment) => {
        if (consume > 0) {
            setcurrentpayment(payment)
            setshowapply(true)
            setvalue("")
        }
    }

    const clearApplied = (payment) => {
        setpayments(prev => prev?.map(pay => {
            if (pay.id === payment.id) {
                return {
                    ...pay,
                    applied: 0
                }
            }
            return pay
        }))
    }

    const applyAmount = (e) => {
        e.preventDefault()
        if (consume <= 0) {
            handleNotification({
                type: 'error',
                message: `Cannot apply amount when amount to consume is already zero.`,
            })
            return
        }
        const remaining = Number(consume) - Number(value || 0)
        if (remaining < 0) {
            handleNotification({
                type: 'error',
                message: `Amount cannot be more than remaining amount (${currencyFormat.format(consume)}).`,
            })
            return
        }
        if (amount(currentpayment.amount) < amount(value)) {
            handleNotification({
                type: 'error',
                message: `Amount cannot be more than available value (${currencyFormat.format(currentpayment.amount)}).`,
            })
            return
        }
        setpayments(prev => prev?.map(pay => {
            if (pay.id === currentpayment.id) {
                return {
                    ...pay,
                    applied: amount(value)
                }
            }
            return pay
        }))
        setvalue("")
        setshowapply(false)
    }

    useEffect(() => {
        const totalapplied = payments?.reduce((prev, curr) => prev + amount(curr.applied), 0)
        let toconsume = amount(receipt?.returnnet) - amount(credit)
        let consumption = toconsume > 0 ? toconsume : 0
        setconsume((amount(consumption) - totalapplied).toFixed(2))
        setapplied(totalapplied)
    }, [payments])


    return (
        <AppModal show={show} setshow={toggle} title={`Reimbursement for ${transno.code}`} prevkeydown={showapply}>
            <form onSubmit={processReimbursement} className="w-[600px] flex flex-col py-3 gap-[20px] no-select">
                <div className="flex gap-[10px]">
                    <div className="flex flex-col items-start gap-[10px] w-full">
                        <label htmlFor="method">Method:</label>
                        <select
                            id="method"
                            name="method"
                            className="w-full placeholder:text-gray-400"
                            value={reimburse?.method}
                            onChange={onChange}
                            required
                        >
                            <option value="" disabled></option>
                            <option value="NONE">NONE</option>
                            <option value="CASH">CASH</option>
                            <option value="CHEQUE">CHEQUE</option>
                            <option value="GCASH">GCASH</option>
                            <option value="VOUCHER">VOUCHER</option>
                            <option value="BANK TRANSFER">BANK TRANSFER</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-start gap-[10px] w-full">
                        <label htmlFor="reference">Reference Code:</label>
                        <input
                            id="reference"
                            name="reference"
                            type="text"
                            className="w-full placeholder:text-gray-400 text-center"
                            value={reimburse?.reference}
                            onChange={onChange}
                            autoComplete="off"
                            placeholder="Reference (optional)"
                        />
                    </div>
                </div>
                <div className="flex gap-[10px]">
                    <div className="flex flex-col w-full items-start gap-[10px]">
                        <label htmlFor="return">Reimbursed/Returned Amount:</label>
                        <input
                            id="return"
                            name="return"
                            type="text"
                            className="w-full placeholder:text-gray-400 text-center"
                            value={reimburse?.amount}
                            placeholder="Enter amount"
                            readOnly={true}
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full items-start gap-[10px]">
                        <label htmlFor="credit">Credit Balance:</label>
                        <input
                            id="credit"
                            name="credit"
                            type="text"
                            className="w-full placeholder:text-gray-400 text-center"
                            value={reimburse?.credit}
                            placeholder="Enter amount"
                            readOnly={true}
                            required
                        />
                    </div>
                </div>
                <div className="px-5 py-3 rounded-[5px] border border-2 border-blue-400 text-sm">
                    <div className="flex gap-[10px] items-center justify-between">
                        <span>Applied: {currencyFormat.format(applied)}</span>
                        <span>
                            Amount Remaining: {currencyFormat.format(consume)}
                        </span>
                    </div>
                </div>
                <div className="px-5 py-3 rounded-[5px] border border-2 border-blue-400 text-sm">
                    {
                        (payments?.length) ? (
                            payments?.map((pay, index) => (
                                <div key={index} className="w-full flex gap-[20px] items-center py-3">
                                    <div className="w-[50px]">{index + 1}.</div>
                                    <div className="w-[200px]">[{pay.method}]</div>
                                    <div className="w-[200px]">
                                        {currencyFormat.format(Number(pay.amount).toFixed(2))}
                                    </div>
                                    <div className="w-[200px]">
                                        {pay.applied ? `-${currencyFormat.format(Number(pay.applied).toFixed(2))}` : ""}
                                    </div>
                                    <div className="w-[80px] flex gap-[10px] items-center justify-end ml-auto">
                                        {pay.applied ? <TrashIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={() => clearApplied(pay)} /> : null}
                                        <ArrowUturnUpIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={() => toggleApply(pay)} />
                                    </div>
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
                <div className="flex justify-center w-full mt-5">
                    <button
                        type="submit"
                        className="button-ctrl px-4"
                        disabled={consume > 0 || loading}
                    >
                        {loading ? "Processing..." : "Process Reimbursement"}
                    </button>
                </div>
            </form>
            {
                (showapply) ? (
                    <div className="absolute w-full h-full bg-red-400 top-0 left-0 bg-opacity-[50%] flex justify-center items-center">
                        <form onSubmit={applyAmount} className="flex flex-col min-w-[400px] h-fit px-5 py-4 bg-white relative gap-[10px]">
                            <div className="flex justify-between mb-3">
                                <div className="font-bold text-[15px]">Apply Amount</div>
                                {/* <div><XMarkIcon className="h-5 w-5 cursor-pointer" onClick={() => setshowapply(false)} /></div> */}
                            </div>
                            <div className="px-5 rounded-[5px] border border-2 border-blue-400 text-sm">
                                <div className="w-full flex gap-[10px] items-center py-3">
                                    <div className="">{currentpayment.method}:</div>
                                    <div className="">
                                        {currencyFormat.format((amount(currentpayment.amount) - amount(currentpayment.applied)).toFixed(2))}
                                    </div>
                                    <div className="ml-auto">REMAINING:</div>
                                    <div className="">
                                        {currencyFormat.format(amount(consume) - amount(value || 0))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    className="w-full placeholder:text-gray-400 text-center"
                                    value={value}
                                    onChange={onAmountChange}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div className="flex justify-center w-full mt-5 gap-[10px]">
                                <button type="submit" className="button-blue">
                                    Apply Amount
                                </button>
                                <button type="button" className="button-link" onClick={() => setshowapply(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null
            }
        </AppModal>
    )
}

export default CasheringReimburse