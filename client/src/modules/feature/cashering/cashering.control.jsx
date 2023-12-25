import React, { useCallback, useEffect } from 'react'

const Transactions = (props) => {
    const {
        shift,
        trans,
        cart,
        action,
        onindex
    } = props

    const keydown = useCallback(e => {
        if (onindex) {
            e.preventDefault()
            if (e.key === 'n') action.newTransaction()
            if (e.key === 'u') action.cancelTransaction()
            if (e.key === 'p') action.paymentTransaction()
            if (e.key === 'f') action.findProduct()
            if (e.key === 'l') action.transactionLogs()
            if (e.key === 'k') action.returnRequest()
            if (e.key === 'h') action.openSchedules()
        }
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => {
            document.removeEventListener('keydown', keydown)
        }
    }, [keydown])

    return (
        <div className="w-full flex no-select gap-[8px]">
            <button
                className="button-ctrl text-xs gap-[10px]"
                disabled={shift === "CLOSE" || trans === "READY"}
                onClick={() => action.newTransaction()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    N
                </span>
                New Transaction
            </button>
            <button
                className="button-ctrl text-xs gap-[10px]"
                disabled={shift === "CLOSE" || trans !== "READY"}
                onClick={() => action.cancelTransaction()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    U
                </span>
                Cancel Transaction
            </button>
            <button
                className="button-ctrl text-xs gap-[10px]"
                disabled={shift === "CLOSE" || cart?.length === 0 || trans === "CANCELLED" || trans === "COMPLETED"}
                onClick={() => action.paymentTransaction()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    P
                </span>
                Payment Transaction
            </button>
            <button
                className="button-ctrl text-xs gap-[10px]"
                disabled={shift === "CLOSE" || trans !== "READY"}
                onClick={() => action.findProduct()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    F
                </span>
                Find Product
            </button>
            <button
                className="button-ctrl text-xs gap-[10px]"
                onClick={() => action.transactionLogs()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    L
                </span>
                Transaction Logs
            </button>
            <button
                className="button-ctrl text-xs gap-[10px]"
                onClick={() => action.returnRequest()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    K
                </span>
                Return Requests
            </button>
            <button
                className="button-ctrl text-xs gap-[10px] ml-auto"
                onClick={() => action.openSchedules()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    H
                </span>
                Schedule
            </button>
            <button
                className={`button-blue text-xs gap-[10px] ${shift === "CLOSE" ? "" : "hidden"}`}
                onClick={() => action.startShift()}
            >
                Start Shift
            </button>
            <button
                className={`button-green text-xs gap-[10px] ${shift === "START" ? "" : "hidden"}`}
                onClick={() => action.endShift()}
            >
                End Shift
            </button>
        </div>
    )
}

const Toggles = (props) => {
    const {
        cart,
        trans,
        action,
        onindex,
        receipt,
    } = props

    const keydown = useCallback(e => {
        if (onindex) {
            e.preventDefault()
            if (e.key === 'd') action.applyDiscount()
            if (e.key === 'c') action.commitReturn()
            if (e.key === 'r') action.returnRequest()
        }
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => {
            document.removeEventListener('keydown', keydown)
        }
    }, [keydown])
    return (
        <div className="flex">
            <button
                className={`button-ui rounded-[0px] flex-grow text-xs gap-[10px] ${trans === "READY" && cart?.length > 0 ? "" : "hover:bg-primary-500 bg-primary-500 line-through"}`}
                onClick={() => action.applyDiscount()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    D
                </span>
                Discount
            </button>
            <button
                className={`button-ui rounded-[0px] flex-grow text-xs gap-[10px] ${(trans === "COMPLETED" && receipt.returnstatus === "APPROVED") ? "" : "hover:bg-primary-500 bg-primary-500 line-through"}`}
                onClick={() => action.commitReturn()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    C
                </span>
                Commit
            </button>
            <button
                className={`button-ui rounded-[0px] flex-grow text-xs gap-[10px]  ${trans !== "COMPLETED" || receipt.forreturn === 0 || receipt.returnstatus || cart?.filter(f => f.id !== undefined).length === 0 ? "hover:bg-primary-500 bg-primary-500 line-through" : ""}`}
                onClick={() => action.returnRequest()}
            >
                <span className="bg-red-400 bg-opacity-[50%] text-white px-2 rounded-[3px]">
                    R
                </span>
                Returns
            </button>
        </div>
    )
}

const Discount = () => {
    return (
        <div className="absolute bottom-0 left-0 px-5 py-7 text-black flex flex-col gap-[8px] text-sm italic no-select hidden">
            <div className="flex gap-[10px] items-center">
                <span className="w-10 h-10 flex items-center justify-center rounded-[50%] bg-white cursor-pointer font-bold">E</span>
                Apply a discount
            </div>
            <div className="flex gap-[10px] items-center">
                <span className="w-10 h-10 flex items-center justify-center rounded-[50%] bg-white cursor-pointer font-bold">Q</span>
                Apply discount to all
            </div>
            <div className="flex gap-[10px] items-center">
                <span className="w-10 h-10 flex items-center justify-center rounded-[50%] bg-white cursor-pointer font-bold">T</span>
                Clear a discount
            </div>
            <div className="flex gap-[10px] items-center">
                <span className="w-10 h-10 flex items-center justify-center rounded-[50%] bg-white cursor-pointer font-bold">Y</span>
                Clear all discounts
            </div>
        </div>
    )
}

const CasheringControl = {
    Transactions,
    Toggles,
    Toggle: {
        Discount
    }
}

export default CasheringControl