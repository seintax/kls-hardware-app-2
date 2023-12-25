import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from "react-query"
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { createInstance } from "../../../utilities/functions/datetime.functions"
import { amount, currencyFormat, equal } from "../../../utilities/functions/number.funtions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { balanceCustomer } from "../../library/customer/customer.services"
import { deleteCredits, fetchCreditsByTransaction, updateCredits } from "../credits/credits.services"
import { OnField } from "./viewer.index"
import ViewerToolFixer from "./viewer.tool.fixer"

const ViewerSectionCredits = ({ id, info, refetcher, setcreditor }) => {
    const { user } = useClientContext()
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
            { name: 'Total Purchase', stack: false, sort: 'total' },
            { name: 'Partial Payment', stack: true, sort: 'partial', size: 220 },
            { name: 'Settled Payment', stack: true, sort: 'payment', size: 350 },
            { name: 'Balance', stack: true, sort: 'balance', size: 350 },
            { name: 'Tended', stack: true, sort: 'tended', size: 300 },
            { name: 'Succeeding', stack: true, size: 250 },
        ]
    }

    const getCreditsByTransaction = useQuery({
        queryKey: ["getCreditsByTransaction", id, instance],
        queryFn: async (e) => await fetchCreditsByTransaction(e.queryKey[1]),
        enabled: !!id
    })

    useEffect(() => {
        if (getCreditsByTransaction.isSuccess) {
            setdata(getCreditsByTransaction.data.result)
            setrecalculated(false)
        }
    }, [getCreditsByTransaction.status, recalculated])

    const showToolData = (value) => {
        setshowtool(true)
        settooldata(value)
    }

    const refetchCredits = () => {
        queryClient.invalidateQueries(["getCreditsByTransaction", id, instance])
        setinstance(createInstance())
        getCreditsByTransaction.refetch()
        setrecalculated(true)
    }

    const items = (item) => {
        return [
            { value: <OnField upper={currencyFormat.format(item.total)} lower={`[${moment(item.time).format("YYYY-MM-DD-HH-mm-ss")}]`} /> },
            { value: <OnField upper={currencyFormat.format(item.partial)} lower={`Status: ${item.status}`} /> },
            {
                value: <OnField
                    upper={currencyFormat.format(item.payment)}
                    lower={moment(item.settledon).format("MM-DD-YYYY hh:mm:ss A")}
                    data={{
                        title: "FOR CREDIT PAYMENT",
                        trigger: showToolData,
                        base: "payment",
                        heading: <>
                            <span className="mr-3">Transaction Net: {currencyFormat.format(info?.net)}</span>
                            <span className="mr-3">Payment: {currencyFormat.format(item.payment)}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Derived payment [ credit balance ~ payment + succeeding ]",
                                trueval: amount(item.succeeding || 0) > 0 ? equal(currencyFormat.format(amount(item.balance || 0)), currencyFormat.format(amount(item.payment || 0) + amount(item.succeeding || 0))) : true,
                                display: currencyFormat.format(amount(item.payment || 0) + amount(item.succeeding || 0)),
                                apply: async (trueval) => {
                                    if (window.confirm("Are you sure you want to apply this solution?")) {
                                        if (window.confirm(`You are about to recompute values with:\n` +
                                            `Credit Payment: ${amount(item.payment) + amount(item.succeeding || 0)}\n` +
                                            `Outcome: ${amount(item.payment) + amount(item.succeeding || 0)}\n\n` +
                                            `Do you wish to proceed?`)) {
                                            let data = {
                                                payment: amount(item.payment) + amount(item.succeeding || 0),
                                                id: item.id
                                            }
                                            let res = await updateCredits(data)
                                            if (res.success) {
                                                refetchCredits()
                                                setshowtool(false)
                                            }
                                        }
                                    }
                                }
                            },
                        ],
                        valid: "A"
                    }}
                />
            },
            {
                value: <OnField
                    upper={currencyFormat.format(item.balance)}
                    lower={`Waived: ${currencyFormat.format(item.waived)}`}
                    data={{
                        title: "FOR CREDIT BALANCE",
                        trigger: showToolData,
                        base: "balance",
                        heading: <>
                            <span className="mr-3">Transaction Net: {currencyFormat.format(info?.net)}</span>
                            <span className="mr-3">Balance: {currencyFormat.format(item.balance)}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Data comparison by transaction NET [ transaction net ]",
                                trueval: equal(currencyFormat.format(info?.net || 0), currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.payment || 0), 0) + data?.reduce((prev, curr) => prev + (curr.status === "ON-GOING" ? amount(curr.balance) : 0), 0))),
                                display: `Trxn NET: ${currencyFormat.format(info?.net)} ~ Total Credit Balance: ${currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.payment || 0), 0) + data?.reduce((prev, curr) => prev + (curr.status === "ON-GOING" ? amount(curr.balance) : 0), 0))}`,
                                apply: async (trueval) => {
                                    if (!trueval) {
                                        if (window.confirm("Are you sure you want to apply this solution?")) {
                                            if (window.confirm(`You are about to recompute values with:\n` +
                                                `Credit Balance: ${info?.net}\n` +
                                                `Outcome: ${info?.net}\n\n` +
                                                `Do you wish to proceed?`)) {
                                                let data = {
                                                    balance: info?.net,
                                                    id: item.id
                                                }
                                                let res = await updateCredits(data)
                                                if (res.success) {
                                                    refetchCredits()
                                                    setshowtool(false)
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                index: "B",
                                label: "Data duplication [ sum of paid and partial ~ 2 x balance ]",
                                trueval: data?.filter(f => f.settledon === item.settledon && f.id !== item.id).length === 0,
                                display: `Duplicate Count: ${data?.filter(f => f.settledon === item.settledon && f.id !== item.id).length || 0}`,
                                apply: async (trueval) => {
                                    if (!trueval) {
                                        if (window.confirm("Are you sure you want to apply this solution?")) {
                                            if (window.confirm(`You are about to delete this duplicate\n` +
                                                `Do you wish to proceed?`)) {
                                                let res = await deleteCredits(item.id)
                                                if (res.success) {
                                                    refetchCredits()
                                                    setshowtool(false)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                        valid: "AB",
                        baseupdate: async (value) => {
                            if (value !== undefined) {
                                let data = {
                                    balance: value,
                                    id: item.id
                                }
                                let res = await updateCredits(data)
                                if (res.success) {
                                    refetchCredits()
                                    setshowtool(false)
                                }
                            }

                        }
                    }}
                />
            },
            { value: <OnField upper={`${currencyFormat.format(item.tended)}`} lower={`Change: ${currencyFormat.format(item.loose)}`} /> },
            { value: <OnField upper={`${currencyFormat.format(item.succeeding || 0)}`} lower="" /> },
            // { value: currencyFormat.format(item.waive) },
        ]
    }

    const toggleCreditUpdate = async () => {
        if (data.length) {
            if (window.confirm("Do you wish to update customer's credit value?")) {
                let customer = data[0].customer
                let res = await balanceCustomer({ id: customer })
                if (res.success) {
                    refetchCredits()
                }
            }
        }
    }

    const summary = () => {
        return {
            key: 0,
            items: [
                { value: "TOTAL" },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.partial || 0), 0))} summary={true} /> },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.payment || 0), 0))} summary={true} /> },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + (curr.status === "ON-GOING" ? amount(curr.balance) : 0), 0))} summary={true} /> },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.tended || 0), 0))} summary={true} /> },
                {
                    value: <>
                        <button className={`button-link text-xs no-select ${user.name === "DEVELOPER" ? "" : "hidden"}`} onClick={() => toggleCreditUpdate()}>Update Creditor Balance</button>
                    </>
                },
            ]
        }
    }

    useEffect(() => {
        if (data) {
            if (data?.length) setcreditor(data[0]?.customer)
            let formatted = data?.map(item => {
                return {
                    ...item,
                    succeeding: amount(item.balance) - (amount(item.payment))
                }
            })
            let tempdata = sorted ? sortBy(formatted, sorted) : formatted
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item)
                }
            }))
        }
        if (!data?.length) setcreditor()
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
                            summary={summary()}
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

export default ViewerSectionCredits