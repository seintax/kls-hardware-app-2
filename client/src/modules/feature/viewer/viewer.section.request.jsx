import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery } from "react-query"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchRequestByTransaction } from "../cashering/cashering.service"
import { OnField } from "./viewer.index"

const ViewerSectionRequest = ({ id }) => {
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Status', stack: false, sort: 'status' },
            { name: 'Aurthorized by', stack: true, sort: 'authorizeby', size: 200 },
            { name: 'Return Total', stack: true, sort: 'rtrntotal', size: 220 },
            { name: 'Return VAT', stack: true, sort: 'rtrnvat', size: 200 },
            { name: 'Return Discount', stack: true, sort: 'rtrnless', size: 200 },
            { name: 'Return NET', stack: true, sort: 'rtrnnet', size: 200 },
            { name: 'Requested by', stack: true, sort: 'requestedby', size: 200 },
            { name: 'Logged', stack: true, sort: 'time', size: 200 },
        ]
    }

    const getRequestsByTransaction = useQuery({
        queryKey: ["getRequestsByTransaction", id],
        queryFn: async (e) => await fetchRequestByTransaction(e.queryKey[1], ""),
        enabled: !!id
    })

    useEffect(() => {
        if (getRequestsByTransaction.isSuccess) {
            setdata(getRequestsByTransaction.data.result)
        }
    }, [getRequestsByTransaction.status])

    const items = (item) => {
        return [
            { value: <OnField upper={item.status} lower={`[${moment(item.time).format("YYYY-MM-DD-HH-mm-ss")}]`} /> },
            { value: <OnField upper={`Approved by: ${item.authorizeby}`} lower={moment(item.authorizeon).format("YYYY-MM-DD hh:mm:ss A")} /> },
            { value: <OnField upper={`${currencyFormat.format(item.rtrntotal)}`} lower={`Prev: ${currencyFormat.format(item.prevtotal)}`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.rtrnvat)}`} lower={`Prev: ${currencyFormat.format(item.prevvat)}`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.rtrnless)}`} lower={`Prev: ${currencyFormat.format(item.prevless)}`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.rtrnnet)}`} lower={`Prev: ${currencyFormat.format(item.prevnet)}`} /> },
            { value: <OnField upper={`Requested by: ${item.requestedby}`} lower={moment(item.requesteddon).format("YYYY-MM-DD hh:mm:ss A")} /> },
            { value: <OnField upper={moment(item.time).format("YYYY-MM-DD hh:mm:ss A")} lower={`Shift: ${item.shift}`} /> },
            // { value: currencyFormat.format(item.value) },
            // { value: currencyFormat.format(item.waive) },
        ]
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item)
                }
            }))
        }
    }, [data, sorted])

    return (
        <div className="w-full">
            {
                (data?.length) ? (

                    <div className="w-[2000px]">
                        <DataRecords
                            columns={columns}
                            records={records}
                            page={startpage}
                            setPage={setstartpage}
                            itemsperpage={itemsperpage}
                            setsorted={setsorted}
                            unmargined={true}
                        />
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="w-full bg-gray-200 backdrop-blur border-b border-gray-300 py-4 px-5">
                            No records.
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ViewerSectionRequest