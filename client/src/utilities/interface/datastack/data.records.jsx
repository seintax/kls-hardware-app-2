import {
    ChevronUpDownIcon
} from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from 'react'
import DataPagination from "./data.pagination"

const DataRecords = ({ columns, records, page, setPage, itemsperpage, setsorted, rowstyle, itemstyle, keeppagination, unmargined, summary }) => {
    const refList = useRef()
    const [data, setData] = useState()
    const [order, setOrder] = useState()
    const [pages, setPages] = useState(1)
    const [index, setIndex] = useState(0)
    const [cachedOrder, setCachedOrder] = useState()

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

    const sortcallback = (index) => {
        let sortedcolumns = cachedOrder ?? order
        let column = sortedcolumns[index]
        if (column.sort && setsorted) {
            let neworder = column.order !== "desc" ? "desc" : "asc"
            sortedcolumns[index].order = neworder
            setsorted({ prop: column.sort, desc: neworder !== "asc" })
            setCachedOrder(sortedcolumns)
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
                <table className="flex-col min-w-full divide-y border-separate divide-gray-300" style={{ borderSpacing: 0 }}>
                    <thead className="bg-gray-50 no-select">
                        <tr className={`${columns?.style}`}>
                            <th
                                scope="col"
                                className={`hidden lg:table-cell sticky top-0 z-10 bg-gray-200 backdrop-blur border-b border-gray-300 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[50px]`}
                            >
                                #
                            </th>
                            {
                                (order?.length) ? (
                                    order?.map((col, colindex) => (
                                        <th
                                            key={colindex}
                                            scope="col"
                                            width={col.size}
                                            className={`${col.stack ? "hidden lg:table-cell" : ""} sticky top-0 z-10 backdrop-blur border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 bg-gray-200 ${col.style} ${col.position}`}
                                        >
                                            <div
                                                className={`flex items-center gap-[10px] group ${col.sort ? "cursor-pointer" : ""}`}
                                                onClick={() => sortcallback(colindex, col)}
                                            >
                                                {col.name}
                                                {col.screenreader ? <span className="sr-only">{col.screenreader}</span> : ""}
                                                {col.sort ? <ChevronUpDownIcon className="h-5 w-5 text-gray-200 group-hover:text-gray-700" /> : ""}
                                            </div>
                                        </th>
                                    ))
                                ) : null
                            }
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {
                            data?.map((row, rowindex) => (
                                <tr
                                    key={row?.key || rowindex}
                                    onClick={row?.onclick}
                                    onDoubleClick={row?.ondoubleclick}
                                    className={`hover:bg-gray-100 ${rowstyle}`}
                                >
                                    <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-sm text-gray-500 lg:table-cell no-select">
                                        {index + rowindex}.
                                    </td>
                                    {
                                        (row.items?.length) ? (
                                            row.items?.map((item, itemindex) => (
                                                <td
                                                    key={itemindex}
                                                    className={`w-full max-w-0 py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6 lg:table-cell ${order[itemindex]?.screenreader ? "flex justify-end gap-2" : ""} ${order[itemindex]?.stack ? "hidden" : ""} ${itemstyle} ${order[itemindex]?.position}`}
                                                    onClick={item?.onclick}
                                                    onDoubleClick={item?.ondoubleclick}
                                                >
                                                    {item.value}
                                                    {
                                                        (itemindex === 0) ? (
                                                            <dl className="font-normal lg:hidden">
                                                                {
                                                                    order?.map((col, colindex) => (
                                                                        <div
                                                                            key={colindex}
                                                                            className={`${col.stack ? "" : "hidden"}`}
                                                                        >
                                                                            <dt className="sr-only">{col.name}</dt>
                                                                            <dd className="mt-1 truncate text-gray-400">
                                                                                {row.items[colindex]?.value}
                                                                            </dd>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </dl>
                                                        ) : null
                                                    }
                                                </td>
                                            ))
                                        ) : null
                                    }
                                </tr>
                            ))

                        }
                        {
                            (!!data?.length && summary) && (
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
                            )
                        }
                        {
                            (!data?.length) && (
                                <tr>
                                    <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-sm text-gray-500 lg:table-cell"></td>
                                    <td colSpan={100} className="w-full max-w-0 py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                        No record listed.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
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

export default DataRecords