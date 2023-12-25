import React from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"

const CasheringReceipt = ({ cart, receipt }) => {

    return (
        <div className="flex-grow w-full text-sm">
            <div className="w-full h-full flex-grow mt-1">
                <div className="flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs">
                    <div className="w-full py-2 px-5">No. of Items</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {cart?.length || 0}
                    </div>
                </div>
                <div className="flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs">
                    <div className="w-full py-2 px-5">Total VAT</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt.totalvat || 0)}
                    </div>
                </div>
                <div className="flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs">
                    <div className="w-full py-2 px-5">Total Purchase</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt.totalprice || 0)}
                    </div>
                </div>
                <div className="flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs">
                    <div className="w-full py-2 px-5">Total Discount</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt.totaldiscount || 0)}
                    </div>
                </div>
                <div className={`flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs ${Number(receipt.applieddiscount) == 0 ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Applied Discount (%)</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt.applieddiscount || 0)}%
                    </div>
                </div>
                <div className={`flex gap-[2px] text-xs ${!receipt?.returnvalue ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">
                        <hr className="linebreak" />
                    </div>
                </div>
                <div className={`flex gap-[2px] text-xs ${!receipt?.returnvalue ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Total Returns</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {receipt?.returntotal}
                    </div>
                </div>
                <div className={`flex gap-[2px] text-xs ${!receipt?.returnvalue ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Returned Net</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt?.returnvalue || 0)}
                    </div>
                </div>
                <div className={`flex gap-[2px] text-xs ${!receipt?.forreturn ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">
                        <hr className="linebreak" />
                    </div>
                </div>
                <div className={`flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs ${!receipt?.forreturn ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Items for Return</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {receipt.forreturn}
                    </div>
                </div>
                {/* <div className={`flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs ${Number(receipt.forreturn) == 0 ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">VAT for Return</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt.returnvat || 0)}
                    </div>
                </div>
                <div className={`flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs ${Number(receipt.forreturn) == 0 ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Price for Return</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt.returnprice || 0)}
                    </div>
                </div>
                <div className={`flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs ${Number(receipt.forreturn) == 0 ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Less for Return</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format((receipt.returndiscount * -1) || 0)}
                    </div>
                </div> */}
                <div className={`flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs ${!receipt.forreturn ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Amount to Return</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(receipt.returnnet || 0)}
                    </div>
                </div>
                <div className={`flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] text-xs ${!receipt.forreturn ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Net after Return</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {currencyFormat.format(Number(receipt.netamount) - Number(receipt.returnnet) || 0)}
                    </div>
                </div>
                <div className={`flex gap-[2px] text-xs ${!receipt.returnstatus ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">
                        <hr className="linebreak" />
                    </div>
                </div>
                <div className={`flex gap-[2px] text-xs ${!receipt.returnstatus ? "hidden" : ""}`}>
                    <div className="w-full py-2 px-5">Return Status</div>
                    <div className="py-2 px-5 w-[150px] text-right">
                        {receipt.returnstatus}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CasheringReceipt