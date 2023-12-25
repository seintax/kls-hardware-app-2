import { CloudArrowUpIcon } from "@heroicons/react/20/solid"
import { FunnelIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataContainer from "../../../utilities/interface/datastack/data.container"
import { migrateDispensing, migratePayment, migrateTransaction } from "../../feature/cashering/cashering.service"
import { migrateCredits } from "../../feature/credits/credits.services"
import { fetchMaintenance } from "./reports.services"

const TemplateMaintenance = ({ report, toggle }) => {
    const { setloading } = useClientContext()
    const [filter, setfilter] = useState({
        fr: "2023-08-07",
        to: "2023-08-07",
        shift: "238",
        module: "pos_sales_transaction"
    })
    const [data, setdata] = useState([])
    const tags = [
        { key: "pos_sales_transaction", value: "trns" },
        { key: "pos_sales_dispensing", value: "sale" },
        { key: "pos_sales_credit", value: "cred" },
        { key: "pos_payment_collection", value: "paym" },
        { key: "pos_return_transaction", value: "rtrn" },
        { key: "pos_return_dispensing", value: "rsal" },
        { key: "pos_return_reimbursement", value: "reim" },
    ]

    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 500
    const [columns, setcolumns] = useState({
        style: '',
        items: [
            { name: 'Date', stack: false, sort: 'date' },
            { name: 'Total Record', stack: true, size: 210 },
        ]
    })

    const items = (item) => {
        let valuearr = []
        for (const prop in item) {
            valuearr.push({ value: item[prop] })
        }
        return valuearr
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
    }, [data, sorted, columns])

    const onChange = (e) => {
        const { name, value } = e.target
        setfilter(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const postData = async () => {
        if (window.confirm(`Do you wish to upload the data for module '${filter.module}'?`)) {
            let tagarr = tags.filter(f => f.key === filter.module)
            let tag = tagarr.length === 1 ? tagarr[0]?.value : undefined
            if (filter.module === "pos_sales_transaction") {
                let res = await migrateTransaction({
                    data: data?.map(item => {
                        for (const prop in item) {
                            if (String(item[prop])?.endsWith(".000Z")) {
                                if (String(item[prop])?.endsWith("T16:00:00.000Z")) {
                                    item[prop] = moment(item[prop]).format("YYYY-MM-DD")
                                    continue
                                }
                                item[prop] = moment(item[prop]).format("YYYY-MM-DD HH:mm:ss")
                            }
                            if (prop.includes("_shift")) {
                                item[prop] = filter.shift
                            }
                        }
                        delete item[`${tag}_id`]
                        return item
                    })
                })
            }
            if (filter.module === "pos_sales_dispensing") {
                let res = await migrateDispensing({
                    data: data?.map(item => {
                        for (const prop in item) {
                            if (String(item[prop])?.endsWith(".000Z")) {
                                if (String(item[prop])?.endsWith("T16:00:00.000Z")) {
                                    item[prop] = moment(item[prop]).format("YYYY-MM-DD")
                                    continue
                                }
                                item[prop] = moment(item[prop]).format("YYYY-MM-DD HH:mm:ss")
                            }
                            if (prop.includes("_shift")) {
                                item[prop] = filter.shift
                            }
                        }
                        delete item[`${tag}_id`]
                        return item
                    })
                })
            }
            if (filter.module === "pos_sales_credit") {
                let res = await migrateCredits({
                    data: data?.map(item => {
                        for (const prop in item) {
                            if (String(item[prop])?.endsWith(".000Z")) {
                                if (String(item[prop])?.endsWith("T16:00:00.000Z")) {
                                    item[prop] = moment(item[prop]).format("YYYY-MM-DD")
                                    continue
                                }
                                item[prop] = moment(item[prop]).format("YYYY-MM-DD HH:mm:ss")
                            }
                            if (prop.includes("_shift")) {
                                item[prop] = filter.shift
                            }
                        }
                        delete item[`${tag}_id`]
                        return item
                    })
                })
            }
            if (filter.module === "pos_payment_collection") {
                let res = await migratePayment({
                    data: data?.map(item => {
                        for (const prop in item) {
                            if (String(item[prop])?.endsWith(".000Z")) {
                                if (String(item[prop])?.endsWith("T16:00:00.000Z")) {
                                    item[prop] = moment(item[prop]).format("YYYY-MM-DD")
                                    continue
                                }
                                item[prop] = moment(item[prop]).format("YYYY-MM-DD HH:mm:ss")
                            }
                            if (prop.includes("_shift")) {
                                item[prop] = filter.shift
                            }
                        }
                        delete item[`${tag}_id`]
                        return item
                    })
                })
            }
        }
    }

    const getData = async (e) => {
        e.preventDefault()
        setloading(true)
        let tagarr = tags.filter(f => f.key === filter.module)
        let tag = tagarr.length === 1 ? tagarr[0]?.value : undefined
        let sql = `SELECT * FROM ${filter.module} WHERE ${tag}_time BETWEEN '${filter.fr} 00:00:01' AND '${filter.to} 23:59:59';`
        let res = await fetchMaintenance(sql)
        if (res.success) {
            if (res.response.length > 0) {
                let columnarr = []
                for (const prop in res.response[0]) {
                    columnarr.push({ name: prop, stack: false })
                }
                setcolumns({
                    style: '',
                    items: columnarr
                })
            }
            setdata(res?.response)
        }
        setloading(false)
    }

    useEffect(() => {
        return () => {
            localStorage.removeItem(report)
        }
    }, [report])

    return (
        <AppModal show={report === "maintenance"} setshow={toggle} title={`REPORT: ${report.replaceAll("-", " ").toUpperCase()}`} full={true} >
            <div className="w-full h-[calc(100%-60px)] bg-gradient-to-b from-white to-gray-400 mb-2 flex flex-col pt-3">
                <form
                    onSubmit={getData}
                    className="flex flex-col gap-[5px] no-select"
                >
                    <label htmlFor="date">Report Filter:</label>
                    <div className="flex w-full items-center gap-[10px]">
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="fr">From:</label>
                            <input
                                type="date"
                                name="fr"
                                id="fr"
                                className="w-[150px] border-none"
                                value={filter.fr}
                                onChange={onChange}
                            />
                        </div>
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="to">To:</label>
                            <input
                                type="date"
                                name="to"
                                id="to"
                                className="w-[150px] border-none"
                                value={filter.to}
                                onChange={onChange}
                            />
                        </div>
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="shift">Shift No.:</label>
                            <input
                                type="number"
                                name="shift"
                                id="shift"
                                className="w-[100px] border-none"
                                value={filter.shift}
                                onChange={onChange}
                            />
                        </div>
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="module">Module:</label>
                            <select
                                name="module"
                                id="module"
                                className="w-[150px] border-none"
                                value={filter.module}
                                onChange={onChange}
                            >
                                <option value="pos_sales_transaction">Transaction</option>
                                <option value="pos_sales_dispensing">Dispensing</option>
                                <option value="pos_sales_credit">Credit</option>
                                <option value="pos_payment_collection">Collection</option>
                                <option value="pos_return_transaction">Return Request</option>
                                <option value="pos_return_dispensing">Refunds</option>
                                <option value="pos_return_reimbursement">Reimbursement</option>
                            </select>
                        </div>
                        <button type="submit">
                            <FunnelIcon
                                className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            />
                        </button>
                        <button type="button" className="ml-auto" onClick={() => postData()}>
                            <CloudArrowUpIcon
                                className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            />
                        </button>
                    </div>
                </form>
                <DataContainer
                    columns={columns}
                    records={records}
                    page={startpage}
                    setPage={setstartpage}
                    itemsperpage={itemsperpage}
                    setsorted={setsorted}
                    keeppagination={true}
                />
            </div>
        </AppModal>
    )
}

export default TemplateMaintenance