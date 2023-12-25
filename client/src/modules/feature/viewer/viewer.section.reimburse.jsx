import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery } from "react-query"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchReimbursementByTransaction } from "../cashering/cashering.service"
import { OnField } from "./viewer.index"

const ViewerSectionReimburse = ({ id }) => {
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Reimbursement Method', stack: false, sort: 'method' },
            { name: 'Amount', stack: true, sort: 'amount', size: 200 },
            { name: 'Account', stack: true, sort: 'account', size: 220 },
            { name: 'Reference', stack: true, sort: 'rtrnvat', size: 1000 },
        ]
    }

    const getReimbursedByTransaction = useQuery({
        queryKey: ["getReimbursedByTransaction", id],
        queryFn: async (e) => await fetchReimbursementByTransaction(e.queryKey[1], ""),
        enabled: !!id
    })

    useEffect(() => {
        if (getReimbursedByTransaction.isSuccess) {
            setdata(getReimbursedByTransaction.data.result)
        }
    }, [getReimbursedByTransaction.status])

    const items = (item) => {
        return [
            { value: <OnField upper={item.method} lower={`[${moment(item.time).format("YYYY-MM-DD-HH-mm-ss")}]`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.amount)}`} lower={`Request: ${item.request}`} /> },
            { value: <OnField upper={`Processed by: ${item.account}`} lower={`Shift: ${item.shift}`} /> },
            { value: <OnField upper={`${item.reference || "N/A"}`} lower={""} /> },
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

export default ViewerSectionReimburse