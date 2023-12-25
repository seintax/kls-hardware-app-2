import React, { useEffect, useState } from 'react'

const DataPrint = ({ columns, records, header, heading, trigger, rowstyle, itemstyle, summary }) => {
    const [data, setData] = useState()
    const [order, setOrder] = useState()
    const [pages, setPages] = useState(1)
    const index = 0

    useEffect(() => {
        setOrder(columns?.items?.map(col => {
            return { ...col, order: "unsorted" }
        }))
    }, [columns])

    useEffect(() => {
        setData(records)
        if (records?.length) trigger()
    }, [records])

    return (
        <>
            <div className="flex flex-col w-full justify-between mt-8 shadow ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg">
                <table className="flex-col min-w-full divide-y border-separate divide-gray-600" style={{ borderSpacing: 1 }}>
                    <thead className="bg-gray-50 no-select">
                        <tr>
                            <td colSpan={100}>{header()}</td>
                        </tr>
                        {
                            (heading) ? heading() : null
                        }
                        <tr className={`${columns?.style}`}>
                            <th
                                scope="col"
                                className={`sticky top-0 z-10 bg-gray-200 backdrop-blur border border-1 border-gray-300 py-3.5 px-2 text-xs font-semibold text-gray-900 w-[50px] bg-gray-200 text-left`}
                            >
                                #
                            </th>
                            {
                                (order?.length) ? (
                                    order?.map((col, colindex) => (
                                        <th
                                            key={colindex}
                                            scope="col"
                                            className={`sticky top-0 z-10 backdrop-blur border border-1 border-gray-300 py-3.5 px-2 text-xs font-semibold text-gray-900 bg-gray-200 ${col.style}`}
                                        >
                                            <div
                                                className={`gap-[10px] ${col.position ? col.position : "text-left"}`}
                                            >
                                                {col.name}
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
                                    className={`hover:bg-gray-100 ${rowstyle}`}
                                >
                                    <td className="border-b border-gray-200 px-2 py-4 text-xs text-gray-500 no-select">{rowindex + 1}.</td>
                                    {
                                        (row.items?.length) ? (
                                            row.items?.map((item, itemindex) => (
                                                <td
                                                    key={itemindex}
                                                    className={`w-auto py-4 border-b border-gray-200 px-2 text-xs font-medium text-gray-900 ${order[itemindex]?.screenreader ? "flex justify-end gap-2" : ""} ${itemstyle} ${order[itemindex]?.position}`}
                                                >
                                                    {item.value}
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
                                                    className={`w-auto py-4 border-b border-gray-200 px-2 text-xs font-medium text-gray-900 ${order[itemindex]?.screenreader ? "flex justify-end gap-2" : ""} ${itemstyle} ${order[itemindex]?.position}`}
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
                                    <td colSpan={100} className="w-full py-4 border-b border-gray-200 pl-4 pr-6 text-xs font-medium text-gray-900 sm:pl-6">
                                        No record listed.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DataPrint