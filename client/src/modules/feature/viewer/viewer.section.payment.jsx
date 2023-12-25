import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from "react-query"
import { sortBy } from "../../../utilities/functions/array.functions"
import { createInstance } from "../../../utilities/functions/datetime.functions"
import { amount, currencyFormat, equal } from "../../../utilities/functions/number.funtions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchPaymentByTransaction, updatePayment } from "../cashering/cashering.service"
import { OnField } from "./viewer.index"
import ViewerToolFixer from "./viewer.tool.fixer"

const ViewerSectionPayment = ({ id, info, refetcher }) => {
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const [showtool, setshowtool] = useState(false)
    const [tooldata, settooldata] = useState()
    const [recalculated, setrecalculated] = useState(false)
    const [instance, setinstance] = useState(createInstance())
    const queryClient = useQueryClient()
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Method of Payment', stack: false, sort: 'method' },
            { name: 'Amount Paid', stack: true, sort: 'amount', size: 220 },
            { name: 'Cheque Details', stack: true, sort: 'refcode', size: 350 },
            { name: 'Status', stack: true, sort: 'refstat', size: 350 },
            { name: 'Logged', stack: true, sort: 'time', size: 300 },
        ]
    }

    const getPaymentByTransaction = useQuery({
        queryKey: ["getPaymentByTransaction", id, instance],
        queryFn: async (e) => await fetchPaymentByTransaction(e.queryKey[1]),
        enabled: !!id
    })

    useEffect(() => {
        if (getPaymentByTransaction.isSuccess) {
            setdata(getPaymentByTransaction.data.result)
            setrecalculated(false)
        }
    }, [getPaymentByTransaction.status, recalculated])

    const showToolData = (value) => {
        setshowtool(true)
        settooldata(value)
    }

    const refetchPayment = () => {
        queryClient.invalidateQueries(["getPaymentByTransaction", id, instance])
        setinstance(createInstance())
        getPaymentByTransaction.refetch()
        setrecalculated(true)
    }

    const items = (item) => {
        return [
            { value: <OnField upper={item.method} lower={`[${moment(item.time).format("YYYY-MM-DD-HH-mm-ss")}]`} /> },
            {
                value: <OnField
                    upper={currencyFormat.format(item.amount)}
                    lower={`Type: ${item.type}`}
                    data={{
                        title: "FOR AMOUNT PAID",
                        trigger: showToolData,
                        heading: <>
                            <span className="mr-3">Transaction NET: {currencyFormat.format(info?.net)}</span>
                            <span className="mr-3">Amount Paid: {currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.amount), 0))}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Data comparison by total payments [ sum of (payments) ]",
                                trueval: equal(currencyFormat.format(amount(info?.net || 0)), currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.amount || 0), 0))),
                                display: `Trxn NET: ${currencyFormat.format(amount(info?.net || 0))} ~ Total Amount Paid: ${currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.amount || 0), 0))}`,
                                apply: async (trueval) => {
                                    if (!trueval) {
                                        if (window.confirm("Are you sure you want to apply this solution?")) {
                                            if (window.confirm(`You are about to recalculate this input with:\n` +
                                                `Paid Amount: ${amount(info?.net || 0)}\n\n` +
                                                `Do you wish to proceed?`)) {
                                                let data = {
                                                    amount: amount(info?.net || 0),
                                                    id: item.id
                                                }
                                                let res = await updatePayment(data)
                                                if (res.success) {
                                                    refetchPayment()
                                                    setshowtool(false)
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        ],
                        valid: "A",
                        baseupdate: async (value) => {
                            if (value !== undefined) {
                                let data = {
                                    amount: value,
                                    id: item.id
                                }
                                let res = await updatePayment(data)
                                if (res.success) {
                                    refetchPayment()
                                    setshowtool(false)
                                }
                            }

                        }
                    }}
                />
            },
            { value: <OnField upper={item.refcode} lower={moment(item.refdate).format("MM-DD-YYYY")} /> },
            { value: <OnField upper={item.refstat} lower={`Reimburse: ${item.reimburse}`} /> },
            { value: <OnField upper={moment(item.time).format("MM-DD-YYYY hh:mm:ss A")} lower={`Shift: ${item.shift}`} /> },
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
    }, [data, sorted, info])

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
            <ViewerToolFixer
                show={showtool}
                setshow={setshowtool}
                tooldata={tooldata}
            />
        </div>
    )
}

export default ViewerSectionPayment