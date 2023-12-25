import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { createInstance } from "../../../utilities/functions/datetime.functions"
import { amount, currencyFormat, equal } from "../../../utilities/functions/number.funtions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchDispensingByTransaction, updateDispensing } from "../cashering/cashering.service"
import { OnField } from "./viewer.index"
import ViewerToolApply from "./viewer.tool.apply"
import ViewerToolFixer from "./viewer.tool.fixer"

const ViewerSectionDispense = ({ id, info, refetcher }) => {
    const navigate = useNavigate()
    const { user, setSelected } = useClientContext()
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const [showtool, setshowtool] = useState(false)
    const [showapply, setshowapply] = useState(false)
    const [summarydata, setsummarydata] = useState()
    const [tooldata, settooldata] = useState()
    const [recalculated, setrecalculated] = useState(false)
    const [instance, setinstance] = useState(createInstance())
    const queryClient = useQueryClient()
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Item', stack: false, sort: 'name' },
            { name: 'Unit', stack: true, sort: 'unit', size: 200 },
            { name: 'Dispensed', stack: true, sort: 'dispense', size: 220 },
            { name: 'VAT', stack: true, sort: 'vat', size: 200 },
            { name: 'Total', stack: true, sort: 'total', size: 200 },
            { name: 'Discount', stack: true, sort: 'less', size: 200 },
            { name: 'Net', stack: true, sort: 'net', size: 200 },
            { name: 'Returned', stack: true, sort: 'returned', size: 200 },
            { name: 'Acquisition', stack: true, sort: 'index', size: 200 },
        ]
    }

    const getDispensingByTransaction = useQuery({
        queryKey: ["getDispensingByTransaction", id, instance],
        queryFn: async (e) => await fetchDispensingByTransaction(e.queryKey[1]),
        enabled: !!id
    })

    useEffect(() => {
        if (getDispensingByTransaction.isSuccess) {
            setdata(getDispensingByTransaction.data.result)
            setrecalculated(false)
        }
    }, [getDispensingByTransaction.status, recalculated])

    const showToolData = (value) => {
        setshowtool(true)
        settooldata(value)
    }

    const refetchDispensing = () => {
        queryClient.invalidateQueries(["getDispensingByTransaction", id, instance])
        setinstance(createInstance())
        getDispensingByTransaction.refetch()
        setrecalculated(true)
    }

    const inventoryLogs = (item) => {
        setSelected(prev => ({
            ...prev,
            inventory: { id: item.item, key: `${item.name} ${item.details} ${item.unit}` }
        }))
        navigate(`/inventory/${item.item}/history`)
    }

    const items = (item) => {
        return [
            {
                value: <OnField
                    upper={
                        <span className="text-blue-700 hover:text-blue-800 cursor-pointer" onClick={() => inventoryLogs(item)}>
                            {`${item.name} ${item.details}`}
                        </span>
                    }
                    lower={`[${item.position}]`} />
            },
            {
                value: <OnField
                    upper={`${item.unit}`}
                    lower={`${item.category}`} />
            },
            {
                value: <OnField
                    upper={`Qty: ${item.dispense}`}
                    lower={`Purchase: ${item.purchase}`}
                    data={{
                        title: "FOR PURCHASE/DISPENSE/RETURN",
                        trigger: showToolData,
                        heading: <>
                            <span className="mr-3">Purchased: {item.purchase}</span>
                            <span className="mr-3">Dispensed: {item.dispense}</span>
                            <span className="mr-3">Returned: {item.returned}</span>
                            <span className="mr-3">Base Discount: {item.less}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Return Value [ price x no. of returns ]",
                                trueval: true,
                                display: currencyFormat.format(amount(item.price) * amount(item.returned))
                            },
                            {
                                index: "B",
                                label: "Return VAT Value [ price x no. of returns x tax rate ]",
                                trueval: true,
                                display: currencyFormat.format(amount(item.price) * amount(item.taxrated) * amount(item.returned))
                            },
                            {
                                index: "C",
                                label: "Return Discount Value [ (base discount / dispense qty) x no. of returns ]",
                                trueval: true,
                                display: currencyFormat.format((amount(item.less) / amount(item.dispense)) * amount(item.returned))
                            },
                            {
                                index: "D",
                                label: "Balanced purchase with dispense and return [ purchase qty - dispense qty + no. of returns ]",
                                trueval: equal(amount(item.purchase) - (amount(item.dispense) + amount(item.returned)), 0),
                                display: amount(item.purchase) - (amount(item.dispense) + amount(item.returned))
                            }
                        ],
                        valid: "ABCD",
                        baseupdate: async (value) => {
                            if (value !== undefined) {
                                let data = {
                                    purchase: value,
                                    dispense: value,
                                    id: item.id
                                }
                                let res = await updateDispensing(data)
                                if (res.success) {
                                    refetchDispensing()
                                    setshowtool(false)
                                }
                            }
                        }
                    }}
                />,
            },
            {
                value: <OnField
                    upper={`${currencyFormat.format(item.vat)}`}
                    lower={`Price: ${currencyFormat.format(item.price)}`}
                    data={{
                        title: "FOR VAT",
                        trigger: showToolData,
                        base: "vat",
                        heading: <>
                            <span className="mr-3">Dispensed: {item.dispense}</span>
                            <span className="mr-3">Price: {currencyFormat.format(item.price)}</span>
                            <span className="mr-3">Tax rate: {currencyFormat.format(item.taxrated)}</span>
                            <span className="mr-3">Base VAT: {currencyFormat.format(item.vat)}</span>
                            <span className="mr-3">Total Value: {currencyFormat.format(item.total)}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Data comparison by base VAT [ sum of (base VAT) ]",
                                trueval: equal(currencyFormat.format(amount(info?.vat || 0)), currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.vat || 0), 0))),
                                display: `Trxn VAT: ${currencyFormat.format(amount(info?.vat || 0))} ~ Total Base Value: ${currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.vat || 0), 0))}`
                            },
                            {
                                index: "B",
                                label: "Data comparison by recalculation [ sum of (base VAT x dispense qty) ]",
                                trueval: equal(currencyFormat.format(amount(info?.vat || 0)), currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.vat || 0) * amount(curr.dispense)), 0))),
                                display: `Trxn VAT: ${currencyFormat.format(amount(info?.vat || 0))} ~ Recalculated: ${currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.vat || 0) * amount(curr.dispense)), 0))}`
                            },
                            {
                                index: "C",
                                label: "Expected VAT by standard calculation [ price x tax rate x dispense qty ]",
                                trueval: equal(currencyFormat.format(amount(item.vat || 0)), currencyFormat.format(amount(item.price) * amount(item.taxrated) * amount(item.dispense)), true),
                                display: currencyFormat.format(amount(item.price) * amount(item.taxrated) * amount(item.dispense)),
                                apply: async (trueval) => {
                                    if (window.confirm("Are you sure you want to apply this solution?")) {
                                        if (window.confirm(`You are about to recalculate this input with:\n` +
                                            `Base VAT: ${amount(item.price) * amount(item.taxrated)}\n` +
                                            `Dispense Qty: ${amount(item.dispense)}\n` +
                                            `Outcome: ${amount(item.price) * amount(item.taxrated) * amount(item.dispense)}\n\n` +
                                            `Do you wish to proceed?`)) {
                                            let data = {
                                                vat: amount(item.price) * amount(item.taxrated) * amount(item.dispense),
                                                id: item.id
                                            }
                                            let res = await updateDispensing(data)
                                            if (res.success) {
                                                refetchDispensing()
                                                setshowtool(false)
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                        valid: "C",
                    }}
                />,
            },
            {
                value: <OnField
                    upper={`${currencyFormat.format(item.total)}`}
                    lower={`TAX: ${item.taxrated * 100}%`}
                    data={{
                        title: "FOR TOTAL",
                        trigger: showToolData,
                        base: "total",
                        heading: <>
                            <span className="mr-3">Purchased: {item.purchase}</span>
                            <span className="mr-3">Dispensed: {item.dispense}</span>
                            <span className="mr-3">Returned: {item.returned}</span>
                            <span className="mr-3">Price: {currencyFormat.format(item.price)}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Purchase Total Value [ price x purchase qty ]",
                                trueval: equal(currencyFormat.format(amount(item.price) * (amount(item.purchase) - amount(item.returned))), currencyFormat.format(amount(item.total))),
                                display: currencyFormat.format(amount(item.price) * amount(item.purchase))
                            },
                            {
                                index: "B",
                                label: "Dispense Total Value [ price x dispense qty ]",
                                trueval: equal(currencyFormat.format(amount(item.price) * amount(item.dispense)), currencyFormat.format(amount(item.total))),
                                display: currencyFormat.format(amount(item.price) * amount(item.dispense)),
                                apply: async (trueval) => {
                                    if (window.confirm("Are you sure you want to apply this solution?")) {
                                        if (window.confirm(`You are about to recalculate this input with:\n` +
                                            `Price: ${amount(item.price)}\n` +
                                            `Dispense Qty: ${amount(item.dispense)}\n` +
                                            `Outcome: ${amount(item.price) * amount(item.dispense)}\n\n` +
                                            `Do you wish to proceed?`)) {
                                            let data = {
                                                total: amount(item.price) * amount(item.dispense),
                                                id: item.id
                                            }
                                            let res = await updateDispensing(data)
                                            if (res.success) {
                                                refetchDispensing()
                                                setshowtool(false)
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                index: "C",
                                label: "Purchase - Dispense Difference [ (price x purchase qty) - (price x dispense qty) ]",
                                trueval: equal(currencyFormat.format((amount(item.price) * amount(item.purchase)) - (amount(item.price) * amount(item.dispense))), currencyFormat.format(amount(item.price) * amount(item.returned))),
                                display: currencyFormat.format((amount(item.price) * amount(item.purchase)) - (amount(item.price) * amount(item.dispense)))
                            }
                        ],
                        valid: "ABC"
                    }}
                />,
            },
            {
                value: <OnField
                    upper={`${currencyFormat.format(item.less)}`}
                    lower={`ADR: ${item.discount}%`}
                    data={{
                        title: "FOR DISCOUNT",
                        trigger: showToolData,
                        base: "less",
                        heading: <>
                            <span className="mr-3">Purchased: {item.purchase}</span>
                            <span className="mr-3">Dispensed: {item.dispense}</span>
                            <span className="mr-3">Total Value: {currencyFormat.format(item.total)}</span>
                            <span className="mr-3">Base Discount: {currencyFormat.format(item.less)}</span>
                            <span className="mr-3">Net Value: {currencyFormat.format(item.net)}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Data comparison by base discount [ sum of (base discount) ]",
                                trueval: equal(currencyFormat.format(amount(info?.less) * (item.dispense ? 1 : 0)), currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.less), 0) * (item.dispense ? 1 : 0))),
                                display: `Trxn Discount: ${currencyFormat.format(amount(info?.less) * (item.dispense ? 1 : 0))} ~ Total Base Value: ${currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.less), 0) * (item.dispense ? 1 : 0))}`
                            },
                            {
                                index: "B",
                                label: "Data comparison by recalculation [ sum of (base discount x dispense qty) ]",
                                trueval: item.dispense ? equal(currencyFormat.format(amount(info?.less)), currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.less) * amount(curr.dispense)), 0))) : false,
                                display: `Trxn Discount: ${currencyFormat.format(amount(info?.less))} ~ Recalculated: ${currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.less) * amount(curr.dispense)), 0))}`
                            },
                            {
                                index: "C",
                                label: "Derived Net Value using base discount [ total dispense value - base discount ]",
                                trueval: equal(currencyFormat.format(amount(item.total) - amount(item.less)), currencyFormat.format(amount(item.net))),
                                display: currencyFormat.format(amount(item.total) - amount(item.less))
                            },
                            {
                                index: "D",
                                label: "Derived Net Value using recalculation [ total dispense value - (base discount x dispense qty) ]",
                                trueval: equal(currencyFormat.format(amount(item.total) - (amount(item.less) * amount(item.dispense))), currencyFormat.format(amount(item.net))),
                                display: currencyFormat.format(amount(item.total) - (amount(item.less) * amount(item.dispense)))
                            },
                            {
                                index: "E",
                                label: "Derived Value per item using base discount [ base discount / dispense qty ]",
                                trueval: equal(currencyFormat.format((amount(item.less || 0) / amount(item.dispense)) || 0), currencyFormat.format(((amount(item.total) - amount(item.net)) / amount(item.dispense)) || 0)),
                                display: amount(item.dispense) ? currencyFormat.format(amount(item.less) / amount(item.dispense)) : amount(item.dispense)
                            },
                            {
                                index: "F",
                                label: "Derived Value per item using recalculation [ (base discount x dispense qty) / dispense qty ]",
                                trueval: item.dispense ? equal(currencyFormat.format((amount(item.less || 0) * amount(item.dispense)) / amount(item.dispense)), currencyFormat.format((amount(item.total) - amount(item.net)) / amount(item.dispense))) : false,
                                display: currencyFormat.format(((amount(item.less) * amount(item.dispense)) / amount(item.dispense)) || 0),
                                apply: async (trueval) => {
                                    if (window.confirm("Are you sure you want to apply this solution?")) {
                                        if (window.confirm(`You are about to recalculate this input with:\n` +
                                            `Base Discount: ${amount(item.less || 0)}\n` +
                                            `Dispense Qty: ${amount(item.dispense)}\n` +
                                            `Outcome: ${amount(item.less || 0) * amount(item.dispense)}\n\n` +
                                            `Do you wish to proceed?`)) {
                                            let data = {
                                                less: amount(item.less || 0) * amount(item.dispense),
                                                id: item.id
                                            }
                                            let res = await updateDispensing(data)
                                            if (res.success) {
                                                refetchDispensing()
                                                setshowtool(false)
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                index: "G",
                                label: "Discount by recalculation [ base discount x dispense qty ]",
                                trueval: equal(currencyFormat.format(amount(item.less) * amount(item.dispense)), currencyFormat.format(amount(item.total) - amount(item.net))),
                                display: currencyFormat.format(amount(item.less) * amount(item.dispense))
                            },
                        ],
                        valid: "CE",
                        baseupdate: async (value) => {
                            if (value !== undefined) {
                                let data = {
                                    less: value,
                                    id: item.id
                                }
                                let res = await updateDispensing(data)
                                if (res.success) {
                                    refetchDispensing()
                                    setshowtool(false)
                                }
                            }
                        }
                    }}
                />,
            },
            {
                value: <OnField
                    upper={`${currencyFormat.format(item.net)}`}
                    lower={`Item: ${item.item}`}
                    data={{
                        title: "FOR NET",
                        trigger: showToolData,
                        base: "net",
                        heading: <>
                            <span className="mr-3">Purchased: {item.purchase}</span>
                            <span className="mr-3">Dispensed: {item.dispense}</span>
                            <span className="mr-3">Total Value: {currencyFormat.format(item.total)}</span>
                            <span className="mr-3">Base Discount: {currencyFormat.format(item.less)}</span>
                            <span className="mr-3">Net Value: {currencyFormat.format(item.net)}</span>
                        </>,
                        scenario: [
                            {
                                index: "A",
                                label: "Purchase Total Value [ price x purchase qty ]",
                                trueval: equal(currencyFormat.format(amount(item.price) * amount(item.purchase)), currencyFormat.format(amount(item.total) + (amount(item.price) * amount(item.returned)))),
                                display: currencyFormat.format(amount(item.price) * amount(item.purchase))
                            },
                            {
                                index: "B",
                                label: "Purchase Net Value by base discount [ (price x purchase qty) - base discount ]",
                                trueval: equal(currencyFormat.format((amount(item.price) * amount(item.purchase)) - amount(item.less)), currencyFormat.format(amount(item.net) + (amount(item.price) * amount(item.returned)))),
                                display: currencyFormat.format((amount(item.price) * amount(item.purchase)) - amount(item.less))
                            },
                            {
                                index: "C",
                                label: "Purchase Net Value by recalculated discount [ (price x purchase qty) - (base discount x purchase qty) ]",
                                trueval: equal(currencyFormat.format((amount(item.price) * amount(item.purchase)) - (amount(item.less) * amount(item.purchase))), currencyFormat.format(amount(item.net) + (amount(item.price) * amount(item.returned)))),
                                display: currencyFormat.format((amount(item.price) * amount(item.purchase)) - (amount(item.less) * amount(item.purchase)))
                            },
                            {
                                index: "D",
                                label: "Dispense Net Value [ (price x dispense qty) - base discount ]",
                                trueval: equal(currencyFormat.format((amount(item.price) * amount(item.dispense)) - amount(item.less)), currencyFormat.format(amount(item.net))),
                                display: currencyFormat.format((amount(item.price) * amount(item.dispense)) - amount(item.less)),
                                apply: async (trueval) => {
                                    if (window.confirm("Are you sure you want to apply this solution?")) {
                                        if (window.confirm(`You are about to recompute on base value with:\n` +
                                            `Price: ${amount(item.price)}\n` +
                                            `Dispense Qty: ${amount(item.dispense)}\n` +
                                            `Base Discount: ${amount(item.less || 0)}\n` +
                                            `Outcome: ${(amount(item.price) * amount(item.dispense) - amount(item.less || 0))}\n\n` +
                                            `Do you wish to proceed?`)) {
                                            let data = {
                                                net: (amount(item.price) * amount(item.dispense) - amount(item.less || 0)),
                                                id: item.id
                                            }
                                            let res = await updateDispensing(data)
                                            if (res.success) {
                                                refetchDispensing()
                                                setshowtool(false)
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                index: "E",
                                label: "Dispense Net Value by recalculated discount [ (price x dispense qty) - (base discount x dispense qty) ]",
                                trueval: equal(currencyFormat.format((amount(item.price) * amount(item.dispense)) - (amount(item.less) * amount(item.dispense))), currencyFormat.format(amount(item.net))),
                                display: currencyFormat.format((amount(item.price) * amount(item.dispense)) - (amount(item.less) * amount(item.dispense)))
                            },
                        ],
                        valid: "ABD"
                    }}
                />,
            },
            {
                value: <OnField
                    upper={`${amount(item.price) * amount(item.returned)}`}
                    lower={`Returned: ${item.returned}`} />
            },
            {
                value: <OnField
                    upper={`${item.acquisition}`}
                    lower={`Conversion: ${item.conv}`} />
            },
        ]
    }

    const toggleApply = () => {
        setsummarydata({
            vat: data?.reduce((prev, curr) => prev + amount(curr.vat || 0), 0),
            total: data?.reduce((prev, curr) => prev + amount(curr.total), 0),
            less: data?.reduce((prev, curr) => prev + amount(curr.less), 0),
            net: data?.reduce((prev, curr) => prev + amount(curr.net), 0),
            returned: data?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.returned)), 0)
        })
        setshowapply(true)
    }

    const summary = () => {
        return {
            key: 0,
            items: [
                { value: "TOTAL" },
                { value: "" },
                { value: "" },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.vat || 0), 0))} summary={true} /> },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.total), 0))} summary={true} /> },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.less), 0))} summary={true} /> },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.net), 0))} summary={true} /> },
                { value: <OnField upper={currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.returned)), 0))} summary={true} /> },
                {
                    value: <>
                        <button className={`button-link text-xs no-select ${user?.name === "DEVELOPER" ? "" : "hidden"}`} onClick={() => toggleApply()}>Apply Summary</button>
                    </>
                },
            ]
        }
    }

    useEffect(() => {
        if (data && info?.id) {
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
            <ViewerToolApply
                id={info?.id}
                show={showapply}
                setshow={setshowapply}
                summarydata={summarydata}
                refetcher={refetcher}
            />
        </div>
    )
}

const DataValue = ({ children, label, trueval }) => {
    return (
        <div className={`px-3 w-full h-[50px] shadow-md cursor-pointer flex flex-col justify-center gap-1 items-start no-select ${trueval ? "bg-green-300 hover:bg-gradient-to-b hover:from-green-200 hover:to-green-300 border-2 border-green-300" : "bg-gray-300 hover:bg-gradient-to-b hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300"}`}>
            <label htmlFor="" className={`text-[11px] font-normal ${label ? "" : "hidden"}`}>{label}</label>
            <span className="ml-3">{children}</span>
        </div>
    )
}

export default ViewerSectionDispense