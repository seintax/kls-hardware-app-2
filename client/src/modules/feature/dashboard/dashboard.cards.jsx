import moment from "moment"
import React, { useEffect, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"

const DashboardCards = ({ data, refetch }) => {
    const [prev, setprev] = useState()
    const [curr, setcurr] = useState()
    const [tday, settday] = useState("Today")
    const [pday, setpday] = useState("Yesterday")

    useEffect(() => {
        if (data?.result) {
            setcurr(data?.result?.length > 0 ? data?.result[0] : undefined)
            setprev(data?.result?.length > 1 ? data?.result[1] : undefined)
            settday("Today")
            setpday("Yesterday")
            if (moment(data?.result[0]?.date).format("YYYY-MM-DD") !== moment(new Date).format("YYYY-MM-DD")) {
                settday(`Recently`)
            }
            if (moment(data?.result[0]?.date).subtract(1, 'days').format("dddd") !== moment(data?.result[1]?.date).format("dddd")) {
                setpday(moment(data?.result[1]?.date).format("dddd") || "Previously")
            }
        }
    }, [data])

    return (
        <div className="w-full flex flex-col xl:flex-row items-start justify-between gap-[20px] mt-[60px]">
            {/* <AppLogo style="h-[250px]" inverted={true} /> */}
            <div className="w-full flex flex-col gap-[5px] p-2 border border-1 border-[#b317a3] rounded-[20px]">
                <div className="text-sm bg-gradient-to-bl from-[#430368] to-[#610259] rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5">
                    Sales Cash Collection
                </div>
                <div className="w-full py-3 px-5 bg-gradient-to-br from-[#430368] to-[#610259] rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[12px]">
                            {pday}: {currencyFormat.format(prev?.sales_cash || 0)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[15px] font-bold">
                            {tday}:
                        </span>
                        <span className="text-lg font-bold">
                            {currencyFormat.format(curr?.sales_cash || 0)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-[5px] p-2 border border-1 border-[#b317a3] rounded-[20px]">
                <div className="text-sm bg-gradient-to-bl from-[#430368] to-[#610259] rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5">
                    Sales Cheque Collection
                </div>
                <div className="w-full py-3 px-5 bg-gradient-to-br from-[#430368] to-[#610259] rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[12px]">
                            {pday}: {currencyFormat.format(prev?.sales_cheque || 0)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[15px] font-bold">
                            {tday}:
                        </span>
                        <span className="text-lg font-bold">
                            {currencyFormat.format(curr?.sales_cheque || 0)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-[5px] p-2 border border-1 border-[#b317a3] rounded-[20px]">
                <div className="text-sm bg-gradient-to-bl from-[#430368] to-[#610259] rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5">
                    Sales GCash Collection
                </div>
                <div className="w-full py-3 px-5 bg-gradient-to-br from-[#430368] to-[#610259] rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[12px]">
                            {pday}: {currencyFormat.format(prev?.sales_gcash || 0)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[15px] font-bold">
                            {tday}:
                        </span>
                        <span className="text-lg font-bold">
                            {currencyFormat.format(curr?.sales_gcash || 0)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-[5px] p-2 border border-1 border-[#b317a3] rounded-[20px]">
                <div className="text-sm bg-gradient-to-bl from-[#430368] to-[#610259] rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5">
                    Credit Cash Collection
                </div>
                <div className="w-full py-3 px-5 bg-gradient-to-br from-[#430368] to-[#610259] rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[12px]">
                            {pday}: {currencyFormat.format(prev?.credit_cash || 0)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[15px] font-bold">
                            {tday}:
                        </span>
                        <span className="text-lg font-bold">
                            {currencyFormat.format(curr?.credit_cash || 0)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-[5px] p-2 border border-1 border-[#b317a3] rounded-[20px]">
                <div className="text-sm bg-gradient-to-bl from-[#430368] to-[#610259] rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5">
                    Credit Cheque Collection
                </div>
                <div className="w-full py-3 px-5 bg-gradient-to-br from-[#430368] to-[#610259] rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[12px]">
                            {pday}: {currencyFormat.format(prev?.credit_cheque || 0)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[15px] font-bold">
                            {tday}:
                        </span>
                        <span className="text-lg font-bold">
                            {currencyFormat.format(curr?.credit_cheque || 0)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-[5px] p-2 border border-1 border-[#b317a3] rounded-[20px]">
                <div className="text-sm bg-gradient-to-bl from-[#430368] to-[#610259] rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5">
                    Credit GCash Collection
                </div>
                <div className="w-full py-3 px-5 bg-gradient-to-br from-[#430368] to-[#610259] rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[12px]">
                            {pday}: {currencyFormat.format(prev?.credit_gcash || 0)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                        <span className="text-[15px] font-bold">
                            {tday}:
                        </span>
                        <span className="text-lg font-bold">
                            {currencyFormat.format(curr?.credit_gcash || 0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCards