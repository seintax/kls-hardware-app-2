import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery } from "react-query"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchReturnByTransaction } from "../cashering/cashering.service"
import { OnField } from "./viewer.index"

const ViewerSectionReturns = ({ id }) => {
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Item', stack: false, sort: 'name' },
            { name: 'Unit', stack: true, sort: 'unit', size: 200 },
            { name: 'Returned', stack: true, sort: 'qty', size: 220 },
            { name: 'Price', stack: true, sort: 'dispense', size: 200 },
            { name: 'Total', stack: true, sort: 'total', size: 200 },
            { name: 'Discount', stack: true, sort: 'less', size: 200 },
            { name: 'Net', stack: true, sort: 'net', size: 200 },
            { name: '', stack: true, size: 200 },
        ]
    }

    const getReturnsByTransaction = useQuery({
        queryKey: ["getReturnsByTransaction", id],
        queryFn: async (e) => await fetchReturnByTransaction(e.queryKey[1]),
        enabled: !!id
    })

    useEffect(() => {
        if (getReturnsByTransaction.isSuccess) {
            setdata(getReturnsByTransaction.data.result)
        }
    }, [getReturnsByTransaction.status])

    const items = (item) => {
        return [
            { value: <OnField upper={`${item.name} ${item.details}`} lower={`[${moment(item.time).format("YYYY-MM-DD-HH-mm-ss")}]`} /> },
            { value: <OnField upper={`${item.unit}`} lower={`${item.category}`} /> },
            { value: <OnField upper={`Qty: ${item.qty}`} lower={`Request: ${item.request}`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.price)}`} lower={`VAT: ${currencyFormat.format(item.vat)}`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.total)}`} lower={`TAX: ${item.taxrated * 100}%`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.less)}`} lower={`ADR: ${item.discount}%`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.net)}`} lower={`VAT: ${currencyFormat.format(item.vat)}`} /> },
            { value: "" },
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

export default ViewerSectionReturns