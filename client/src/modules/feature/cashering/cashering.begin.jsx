import moment from "moment"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { generateZeros } from "../../../utilities/functions/string.functions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { createTransaction, fetchTransactionById, fetchTransactionByReady, fetchTransactionByShift } from "./cashering.service"

const CasheringBegin = ({ show, toggle, shiftno, settransno, setcart, setreceipt, settrans }) => {
    const { handleNotification } = useNotificationContext()
    const { user } = useClientContext()
    const buttonRef = useRef()
    const inputRef = useRef()
    const [order, setorder] = useState(0)
    const [code, setcode] = useState("")
    const [exist, setexist] = useState()
    const [receipttype, setreceipttype] = useState("")
    const [receiptcode, setreceiptcode] = useState("")

    const keydown = useCallback(e => {
        if (show) {
            if (e.shiftKey && e.key === "!") {
                setreceipttype("Cash Sales Invoice")
                setreceiptcode("CH")
            }
            if (e.shiftKey && e.key === "@") {
                setreceipttype("Charge Sales Invoice")
                setreceiptcode("CR")
            }
            if (e.shiftKey && e.key === "#") {
                setreceipttype("Delivery Receipt")
                setreceiptcode("DR")
            }
            if (e.shiftKey && e.key === "$") {
                setreceipttype("Order Slip")
                setreceiptcode("OS")
            }
        }
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => { document.removeEventListener('keydown', keydown) }
    }, [keydown])

    const onFocus = (e) => {
        e.target.select()
    }

    const onChange = (e) => {
        const { value } = e.target
        setorder(value)
    }

    const initiateTransaction = (transno, status) => {
        settransno(transno)
        settrans(status)
        setcart([])
        setreceipt({
            totalprice: 0,
            totalvat: 0,
            totaldiscount: 0,
            applieddiscount: 0,
            discountedcarts: 0,
            rawnetamount: 0,
            netamount: 0
        })
        toggle()
    }

    const beginTransaction = async (e) => {
        e.preventDefault()
        if (!code) {
            handleNotification({
                type: 'error',
                message: "Unable to begin transaction with empty transaction code.",
            })
            return
        }
        if (exist) {
            initiateTransaction(exist, exist.status)
        }
        else {
            if (receipttype === "") {
                handleNotification({
                    type: 'error',
                    message: "Receipt type has not been defined.",
                })
                return
            }
            if (Number(order) > 0) {
                let param = {
                    code: code,
                    ordno: `${receiptcode}${generateZeros(order, 9)}`,
                    shift: shiftno,
                    account: user.id,
                    date: moment(new Date).format("YYYY-MM-DD")
                }
                createTransaction(param)
                    .then(async (ret) => {
                        if (ret?.success) {
                            let id = ret?.result?.id
                            let res = await fetchTransactionById(id)
                            let trns = res?.result
                            if (trns) initiateTransaction(trns, trns.status)
                        }
                        else {
                            handleNotification({
                                type: 'error',
                                message: ret?.error?.code === "ER_DUP_ENTRY" ? ret?.error?.sqlMessage : "'An error occured during data mutation.'",
                            })
                        }
                    })
                    .catch((err) => {
                        handleNotification({
                            type: 'error',
                            message: err.message,
                        })
                    })
            }
        }
    }

    const identifyReceiptType = (ordno) => {
        if (ordno) {
            if (ordno?.startsWith("0")) {
                setreceipttype("")
                setreceiptcode("")
                return
            }
            if (ordno?.startsWith("CH")) {
                setreceipttype("Cash Sales Invoice")
                setreceiptcode("CH")
                return
            }
            if (ordno?.startsWith("CR")) {
                setreceipttype("Charge Sales Invoice")
                setreceiptcode("CR")
                return
            }
            if (ordno?.startsWith("DR")) {
                setreceipttype("Delivery Receipt")
                setreceiptcode("DR")
                return
            }
            if (ordno?.startsWith("OS")) {
                setreceipttype("Order Slip")
                setreceiptcode("OS")
                return
            }
        }
    }

    const retrieveTransaction = async (shiftno) => {
        setreceipttype("")
        setexist()
        let exs = await fetchTransactionByReady(shiftno)
        if (exs?.success && exs?.result?.status === "READY") {
            setexist(exs?.result)
            setcode(exs?.result.code)
            setorder(Number(exs?.result.ordno.slice(2)))
            identifyReceiptType(exs?.result.ordno)
            buttonRef.current.focus()
            return
        }
        inputRef.current.focus()
        let trncode = `${moment(new Date).format("YYYYMMDD")}-${generateZeros(shiftno, 5)}`
        let defcode = `${trncode}-000000`
        let res = await fetchTransactionByShift(defcode, trncode)
        if (!res?.result?.code) {
            handleNotification({
                type: 'error',
                message: "You have an invalid transaction code sequence."
            })
            setcode()
            return
        }
        let codes = res?.result?.code?.split("-")
        let sequence = Number(codes[2]) + 1
        setcode(`${moment(new Date).format("YYYYMMDD")}-${generateZeros(shiftno, 5)}-${generateZeros(sequence, 6)}`)
    }

    useEffect(() => {
        if (show) retrieveTransaction(shiftno)
    }, [show, shiftno])

    return (
        <AppModal show={show} setshow={toggle} title="Begin Transaction">
            <form onSubmit={beginTransaction} className="w-[400px] flex flex-col py-3 gap-[20px] no-select">
                <div className="flex flex-col gap-[5px] text-sm">
                    <div className="bg-primary-600 text-white px-3 py-0.5 text-xs rounded-[3px] mr-[5px] w-fit">
                        Shift +
                    </div>
                    <div className="w-full flex gap-[5px]">
                        <div className="w-full bg-primary-600 cursor-pointer rounded-[5px] text-white text-left py-2 px-3">
                            <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px] mr-[5px] text-xs">
                                1
                            </span>
                            Cash Sales Invoice
                        </div>
                        <div className="w-full bg-primary-600 cursor-pointer rounded-[5px] text-white text-left py-2 px-3">
                            <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px] mr-[5px] text-xs">
                                2
                            </span>
                            Charge Sales Invoice
                        </div>
                    </div>
                    <div className="w-full flex gap-[5px]">
                        <div className="w-full bg-primary-600 cursor-pointer rounded-[5px] text-white text-left py-2 px-3">
                            <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px] mr-[5px] text-xs">
                                3
                            </span>
                            Delivery Receipt
                        </div>
                        <div className="w-full bg-primary-600 cursor-pointer rounded-[5px] text-white text-left py-2 px-3">
                            <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px] mr-[5px] text-xs">
                                4
                            </span>
                            Order Slip
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-[10px]">
                    <label htmlFor="order">{receipttype === "" ? "<Please select a Receipt Type>" : `${receipttype} No.:`}</label>
                    <input
                        ref={inputRef}
                        id="order"
                        type="number"
                        className="w-full placeholder:text-gray-400 text-center"
                        placeholder="Enter unique receipt type no."
                        value={order}
                        onChange={onChange}
                        onFocus={onFocus}
                        disabled={exist}
                    />
                </div>
                <div className="w-full flex justify-center mt-5">
                    Current Transaction No.: {code}
                </div>
                <div className="flex justify-center w-full mt-5">
                    <button ref={buttonRef} type="submit" className="button-link">
                        {exist ? "Resume" : "Begin"} Transaction
                    </button>
                </div>
            </form>
        </AppModal>
    )
}

export default CasheringBegin