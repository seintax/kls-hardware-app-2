import {
    ChevronUpDownIcon
} from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from 'react'
import DataPagination from "./data.pagination"

const DataContainer = ({ columns, records, page, setPage, itemsperpage, setsorted, rowstyle, itemstyle, keeppagination, unmargined, summary }) => {
    // const [page, setPage] = useState(1)
    const refList = useRef()
    const [data, setData] = useState()
    const [order, setOrder] = useState()
    const [pages, setPages] = useState(1)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        setOrder(columns?.items?.map(col => {
            return { ...col, order: "unsorted" }
        }))
    }, [columns])

    useEffect(() => {
        if (records) {
            let lastindex = (page || 1) * (itemsperpage || 10)
            let firstindex = lastindex - (itemsperpage || 10)
            setIndex(firstindex + 1)
            setPages(Math.ceil(records?.length / itemsperpage) || 1)
            setData(records?.slice(firstindex, lastindex))
        }
    }, [records, page])

    const sortcallback = (index, column) => {
        if (column.sort && setsorted) {
            setsorted({ prop: column.sort, desc: column.order === "asc" })
            let neworder = column.order === "desc" || column.order === "unsorted" ? "asc" : "desc"
            let sortedcolumns = [...order]
            sortedcolumns[index].order = neworder
            setOrder(sortedcolumns)
        }
    }

    const scrollToTop = () => {
        refList.current.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            <div ref={refList} className={`flex flex-col justify-between shadow overflow-auto ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg ${unmargined ? "" : "mt-8"}`}>
                <div className="flex-col min-w-full divide-y border-separate divide-gray-300" style={{ borderSpacing: 0 }}>
                    <div className="bg-gray-50 no-select w-fit">
                        <div className={`${columns?.style} flex w-fit`}>
                            <div
                                scope="col"
                                className={`sticky top-0 z-10 bg-gray-200 backdrop-blur border-b border-gray-300 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[50px]`}
                            >
                                #
                            </div>
                            {
                                (order?.length) ? (
                                    order?.map((col, colindex) => (
                                        <div
                                            key={colindex}
                                            scope="col"
                                            className={`w-[300px] flex-none sticky top-0 z-10 backdrop-blur border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 bg-gray-200 ${col.style}`}
                                        >
                                            <div
                                                className={`flex items-center gap-[10px] group ${col.sort ? "cursor-pointer" : ""}`}
                                                onClick={() => sortcallback(colindex, col)}
                                            >
                                                {col.name}
                                                {col.sort ? <ChevronUpDownIcon className="h-5 w-5 text-gray-200 group-hover:text-gray-700" /> : ""}
                                            </div>
                                        </div>
                                    ))
                                ) : null
                            }
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 flex flex-col">
                        {
                            data?.map((row, rowindex) => (
                                <div
                                    key={row?.key || rowindex}
                                    className={`hover:bg-gray-100 flex ${rowstyle}`}
                                >
                                    <div className="w-[50px] bg-white border-b border-gray-200 pl-6 pr-3 py-4 text-sm text-gray-500 lg:table-cell no-select">
                                        {index + rowindex}.
                                    </div>
                                    {
                                        (row.items?.length) ? (
                                            row.items?.map((item, itemindex) => (
                                                <div
                                                    key={itemindex}
                                                    className={`w-[300px] flex-none bg-white py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:pl-6 ${itemstyle}`}
                                                >
                                                    {item.value}
                                                </div>
                                            ))
                                        ) : null
                                    }
                                </div>
                            ))

                        }
                        {
                            (!!data?.length && summary) && (
                                <table>
                                    <tbody>
                                        <tr
                                            key={summary?.key}
                                            className={`bg-gray-200`}
                                        >
                                            <td className="border-b border-gray-200 px-2 py-4 text-xs text-gray-500 no-select">&nbsp;</td>
                                            {
                                                (summary.items?.length) ? (
                                                    summary.items?.map((item, itemindex) => (
                                                        <td
                                                            key={itemindex}
                                                            className={`w-full max-w-0 py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6 lg:table-cell ${order[itemindex]?.screenreader ? "flex justify-end gap-2" : ""} ${itemstyle} ${order[itemindex]?.position}`}
                                                        >
                                                            <b>{item.value}</b>
                                                        </td>
                                                    ))
                                                ) : null
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            )
                        }
                        {
                            (!data?.length) && (
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-sm text-gray-500 lg:table-cell"></td>
                                            <td colSpan={100} className="w-full max-w-0 py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                                No record listed.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </div>
            </div>
            <DataPagination
                itemsperpage={itemsperpage}
                totalitems={records?.length || 0}
                itemcount={data?.length || 0}
                page={page}
                pages={pages}
                setPage={setPage}
                keep={keeppagination}
                scrollToTop={scrollToTop}
            />
        </>
    )
}

export default DataContainer