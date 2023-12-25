import React from 'react'
import { generateZeros } from "../../../utilities/functions/string.functions"
import { OnClipper } from "../viewer/viewer.index"

const CasheringNotice = (props) => {
    const {
        user,
        trans,
        shiftNo,
        orderNo,
        transNo,
        startCash,
        drawerCash,
        transCount
    } = props

    const identifyReceiptType = (ordno) => {
        if (!ordno || ordno.startsWith("0")) {
            return "Receipt Type No."
        }
        if (ordno.startsWith("CH")) {
            return "Cash Sales Invoice No."
        }
        if (ordno.startsWith("CR")) {
            return "Charge Sales Invoice No."
        }
        if (ordno.startsWith("DR")) {
            return "Delivery Receipt No."
        }
        if (ordno.startsWith("OS")) {
            return "Order Slip No."
        }
    }

    return (
        <div className="w-full flex no-select gap-[10px] py-2 text-sm">
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs">
                Cashier: <span className="text-black font-bold ml-1 mt-2 text-[16px]">{user}</span>
            </div>
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs">
                Shift No.: <span className="text-black font-bold ml-1 mt-2 text-[16px]">{generateZeros(shiftNo, 4) || "Not Applicable"}</span>
            </div>
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs">
                {identifyReceiptType(orderNo)}: <span className={`text-black font-bold ml-1 mt-2 text-[16px] ${trans === "CANCELLED" ? "line-through text-gray-600 font-normal" : ""}`}>{orderNo || "No Order"}</span>
            </div>
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs">
                Transaction No.:
                <span className={`text-black font-bold ml-1 mt-2 text-[16px] whitespace-nowrap ${trans === "CANCELLED" ? "line-through text-gray-600 font-normal" : ""}`}>
                    {
                        transNo ?
                            <OnClipper id={transNo} /> :
                            "No Transaction"
                    }
                </span>
            </div>
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs">
                Starting Cash: <span className="text-black font-bold ml-1 mt-2 text-[16px]">{startCash}</span>
            </div>
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs">
                Drawer Cash: <span className="text-black font-bold ml-1 mt-2 text-[16px]">{drawerCash}</span>
            </div>
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs">
                Status: <span className="text-black font-bold ml-1 mt-2 text-[16px]">{trans}</span>
            </div>
            <div className="text-gray-500 bg-gradient-to-b from-gray-200 to-gray-300 py-2 px-3 rounded-[5px] flex flex-col pr-10 text-xs ml-auto">
                No. of Transactions: <span className="text-black font-bold ml-1 mt-2 text-[16px]">{transCount}</span>
            </div>
        </div>
    )
}

export default CasheringNotice