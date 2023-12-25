import { ArrowUturnUpIcon, TrashIcon } from "@heroicons/react/24/solid"
import React from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import CasheringControl from "./cashering.control"

const CasheringOrders = ({ cart, setcart, container, trans, receipt, returnCart, cancelReturn }) => {

    const deleteCart = (item) => {
        if (window.confirm(`Do you wish to delete ${item?.input?.product} (${item?.input?.qty} qty)?`)) {
            setcart(cart?.filter(i => i.position !== item.position))
        }
    }

    return (
        <div className="w-full text-sm bg-gradient-to-r from-primary-200 to-primary-300 relative pb-1">
            <div className="flex gap-[2px] bg-primary-500 text-white text-xs no-select py-2">
                <div className="w-[calc(100%-20px)] cursor-default">&emsp;DESCRIPTION</div>
                <div className="w-[150px] cursor-default">QTY</div>
                <div className="w-[150px] cursor-default">PRICE</div>
                <div className="w-[150px] cursor-default">VAT</div>
                <div className="w-[150px] cursor-default">TOTAL</div>
                <div className="w-[150px] cursor-default">LESS</div>
                <div className="w-[250px] cursor-default">NET</div>
                <div className="w-[150px] cursor-default"></div>
            </div>
            <div style={{ height: container - 62 }} className="w-[calc(100%-5px)] h-[626px] overflow-y-scroll flex-grow mt-1 text-xs no-select ">
                {
                    cart?.map((item, index) => (
                        <div key={index} className="flex gap-[2px] hover:bg-primary-400 hover:bg-opacity-[30%] py-2">
                            <div className="w-full flex flex-wrap items-center gap-[5px]">
                                <span className="w-full">&emsp;{item?.input.product}</span>
                                {
                                    (trans === "COMPLETED") ?
                                        <span className="bg-gradient-to-r from-red-400 to-red-500 rounded-[5px] text-xs px-2 py-0.5 ml-3">
                                            Returned: {item?.returned}
                                        </span> : null
                                }
                                {
                                    (item?.toreturn) ?
                                        <span
                                            className="py-0.5 pr-2 bg-gradient-to-r from-cyan-400 bg-cyan-500 rounded-[5px] text-xs flex items-center cursor-pointer"
                                            onClick={() => cancelReturn(item)}
                                        >
                                            <ArrowUturnUpIcon className="h-3 w-3 text-green-700 mx-1" />
                                            For Return: {item?.toreturn}
                                        </span> : null
                                }
                            </div>
                            <div className="w-[150px] flex flex-wrap">
                                <span className="w-full">{item?.input?.qty}</span>
                                <span className="w-full text-cyan-500 ml-[-5px]">
                                    {(item?.toreturn) ? `-${item?.return?.qty}` : null}
                                </span>
                            </div>
                            <div className="w-[150px]">
                                {/* {currencyFormat.format(item?.input?.unit)} */}
                                {currencyFormat.format(item?.price)}
                            </div>
                            <div className="w-[150px] flex flex-wrap">
                                <span className="w-full">
                                    {currencyFormat.format(item?.input?.vat)}
                                </span>
                                <span className="w-full text-cyan-500 ml-[-5px]">
                                    {(item?.toreturn) ? `-${currencyFormat.format(item?.return?.vat)}` : null}
                                </span>
                            </div>
                            <div className="w-[150px] flex flex-wrap">
                                <span className="w-full">
                                    {currencyFormat.format(item?.input?.price)}
                                </span>
                                <span className="w-full text-cyan-500 ml-[-5px]">
                                    {(item?.toreturn) ? `-${currencyFormat.format(item?.return?.price)}` : null}
                                </span>
                            </div>
                            <div className="w-[150px] flex flex-wrap">
                                <span className="w-full">
                                    {currencyFormat.format(item?.less || 0)}
                                </span>
                                <span className="w-full text-cyan-500 ml-[-5px]">
                                    {(item?.toreturn && item?.return?.less) ? `-${currencyFormat.format(item?.return?.less || 0)}` : null}
                                </span>
                            </div>
                            <div className="w-[250px] flex flex-wrap">
                                <span className="w-full">
                                    {currencyFormat.format(item?.net)}
                                </span>
                                <span className="w-full text-cyan-500 ml-[-5px]">
                                    {(item?.toreturn) ? `-${currencyFormat.format(item?.return?.net)}` : null}
                                </span>
                            </div>
                            <div className="w-[115px] flex justify-end">
                                {
                                    trans === "COMPLETED" ? (
                                        ((!receipt?.returnstatus && (item?.input?.qty - (item?.return?.qty || 0)) > 0) && item?.id) ? (
                                            <ArrowUturnUpIcon className="h-4 w-4 cursor-pointer text-green-700" onClick={() => returnCart(item)} />
                                        ) : null
                                    ) : (
                                        <TrashIcon className="h-4 w-4 cursor-pointer text-red-700" onClick={() => deleteCart(item)} />
                                    )
                                }
                                &emsp;
                            </div>
                        </div>
                    ))
                }
            </div>
            <CasheringControl.Toggle.Discount />
        </div>
    )
}

export default CasheringOrders