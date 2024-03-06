import { PrinterIcon } from "@heroicons/react/20/solid"
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/solid"
import { saveAs } from 'file-saver'
import moment from "moment"
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchRunningStocks } from "./reports.services"

const TemplateRunningStocks = ({ report, toggle }) => {
    const { setloading } = useClientContext()
    const [filter, setfilter] = useState({
        fr: moment(new Date()).subtract(7, 'days').format("YYYY-MM-DD"),
        to: moment(new Date()).format("YYYY-MM-DD")
    })
    const [data, setdata] = useState([])

    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Item name', stack: false, sort: 'date' },
            { name: 'Total Delivery', stack: true, sort: 'delivered', size: 210 },
            { name: 'Total Sold', stack: true, sort: 'dispensed', size: 210 },
            { name: 'Total Transfer', stack: true, sort: 'transfered', size: 210 },
            { name: 'Total Converted', stack: true, sort: 'converted', size: 210 },
            { name: 'Balance', stack: true, sort: 'balance', size: 210 },
        ]
    }

    const items = (item) => {
        return [
            { value: `${item.name} ${item.details}` },
            { value: item.delivered },
            { value: item.dispensed },
            { value: item.transfered },
            { value: item.converted },
            { value: item?.balance },
        ]
    }

    const print = (item) => {
        return [
            { value: `${item.name} ${item.details}` },
            { value: item.delivered },
            { value: item.dispensed },
            { value: item.transfered },
            { value: item.converted },
            { value: item?.balance },
        ]
    }

    const summary = () => {
        return {
            key: 0,
            items: [
                { value: "TOTAL" },
                { value: data?.reduce((prev, curr) => prev + curr.delivered, 0) },
                { value: data?.reduce((prev, curr) => prev + curr.dispensed, 0) },
                { value: data?.reduce((prev, curr) => prev + curr.transfered, 0) },
                { value: data?.reduce((prev, curr) => prev + curr.converted, 0) },
                { value: data?.reduce((prev, curr) => prev + curr?.balance, 0) },
            ]
        }
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    print: print(item)
                }
            }))
        }
    }, [data, sorted])

    const onChange = (e) => {
        const { name, value } = e.target
        setfilter(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const getData = async () => {
        // e.preventDefault()
        setloading(true)
        let res = await fetchRunningStocks()
        setdata(res?.result)
        setloading(false)
    }

    const printData = () => {
        let forprint = records?.map(rec => {
            return {
                ...rec,
                items: rec.print
            }
        })
        localStorage.setItem(report, JSON.stringify({
            title: "RUNNING STOCKS REPORT",
            subtext: `as of: ${moment(new Date()).format("MMMM DD, YYYY hh:mm:ss a")}`,
            data: forprint,
            summary: summary()
        }))
        window.open(`/#/print/${report}/${moment(new Date()).format("MMDDYYYYHHmmss")}`, '_blank')
    }

    const exportData = () => {
        if (data?.length) {
            let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            const ws = XLSX.utils.json_to_sheet([...data])
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            const excelData = new Blob([excelBuffer], { type: type })
            saveAs(excelData, `${report?.toLowerCase()?.replaceAll("-", "_")}_exported_on_${moment(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
        }
    }

    useEffect(() => {
        if (report === "running-stocks")
            getData()
        return () => {
            localStorage.removeItem(report)
        }
    }, [report])

    return (
        <AppModal show={report === "running-stocks"} setshow={toggle} title={`REPORT: ${report.replaceAll("-", " ").toUpperCase()}`} full={true} >
            <div className="w-full h-[calc(100%-60px)] bg-gradient-to-b from-white to-gray-400 mb-2 flex flex-col pt-3">
                <form
                    // onSubmit={getData}
                    className="flex flex-col gap-[5px] no-select"
                >
                    {/* <label htmlFor="date">Report Filter:</label> */}
                    <div className="flex flex-wrap items-center gap-[10px]">
                        {/* <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="fr">From:</label>
                            <input
                                type="date"
                                name="fr"
                                id="fr"
                                className="w-[250px] border-none"
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
                                className="w-[250px] border-none"
                                value={filter.to}
                                onChange={onChange}
                            />
                        </div>
                        <button type="submit">
                            <FunnelIcon
                                className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            />
                        </button> */}
                        <ArchiveBoxArrowDownIcon
                            className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer ml-auto mr-3"
                            onClick={() => exportData()}
                        />
                        <PrinterIcon
                            className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            onClick={() => printData()}
                        />
                    </div>
                </form>
                <DataRecords
                    columns={columns}
                    records={records}
                    page={startpage}
                    setPage={setstartpage}
                    itemsperpage={itemsperpage}
                    setsorted={setsorted}
                    keeppagination={true}
                />
            </div>
            <div className="font-bold text-lg ml-auto flex gap-5">
                <span>
                    <span className="no-select mr-3">Total Sales:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.sales_cash) + amount(curr.sales_cheque) + amount(curr.sales_gcash) + amount(curr.sales_credit || 0)), 0) || 0)}
                </span>
                <span>
                    <span className="no-select mr-3">Total Collection:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.credit_cash) + amount(curr.credit_cheque) + amount(curr.credit_gcash)), 0) || 0)}
                </span>
            </div>
        </AppModal>
    )
}

export default TemplateRunningStocks