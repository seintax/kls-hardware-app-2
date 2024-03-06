import { ArchiveBoxArrowDownIcon, FunnelIcon, PrinterIcon } from "@heroicons/react/24/solid"
import { saveAs } from 'file-saver'
import moment from "moment"
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchDailyInventory } from "./reports.services"

const TemplateDailyInventory = ({ report, toggle }) => {
    const { setloading } = useClientContext()
    const [filter, setfilter] = useState({
        fr: moment(new Date()).format("YYYY-MM-DD"),
        to: moment(new Date()).format("YYYY-MM-DD"),
    })
    const [data, setdata] = useState([])

    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Product', stack: false, sort: 'name' },
            { name: 'Price', stack: true, sort: 'price', size: 150 },
            { name: 'Beg. Qty', stack: true, sort: 'received', size: 150 },
            { name: 'Beg. Amt', stack: true, size: 150 },
            { name: 'Tot. Qty', stack: true, sort: 'sold', size: 150 },
            { name: 'Tot. Amt', stack: true, size: 150 },
            { name: 'Sold Qty', stack: true, sort: 'purchase', size: 150 },
            { name: 'Sold Amt', stack: true, size: 150 },
            { name: 'End Qty', stack: true, sort: 'remain', size: 150 },
            { name: 'End Amt', stack: true, size: 150 }
        ]
    }

    const items = (item) => {
        return [
            { value: `${item.name} ${item.details} ${item.unit}` },
            { value: currencyFormat.format(item.price) },
            { value: item.received },
            { value: currencyFormat.format(amount(item.received) * amount(item.price)) },
            { value: item.sold },
            { value: currencyFormat.format(amount(item.sold) * amount(item.price)) },
            { value: item.purchase },
            { value: currencyFormat.format(amount(item.purchase) * amount(item.price)) },
            { value: item.remain },
            { value: currencyFormat.format(amount(item.remain) * amount(item.price)) },
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
    }, [data, sorted, filter.type])

    const onChange = (e) => {
        const { value } = e.target
        setfilter(prev => ({
            ...prev,
            fr: value,
        }))
    }

    const getData = async (e) => {
        e.preventDefault()
        setloading(true)
        let res = await fetchDailyInventory(moment(filter.fr).format("YYYY-MM-DD"))
        setdata(res?.result)
        setloading(false)
    }

    const printData = () => {
        localStorage.setItem(report, JSON.stringify({
            title: "DAILY INVENTORY REPORT",
            subtext: `Date: ${moment(filter.fr).format("MMMM DD, YYYY")}`,
            data: records
        }))
        window.open(`/#/print/${report}/${moment(filter.fr).format("MMDDYYYY")}`, '_blank')
    }

    const exportData = () => {
        if (data?.length) {
            let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            const ws = XLSX.utils.json_to_sheet([{ ...filter }, ...data])
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            const excelData = new Blob([excelBuffer], { type: type })
            saveAs(excelData, `${report?.toLowerCase()?.replaceAll("-", "_")}_exported_on_${moment(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
        }
    }

    useEffect(() => {
        return () => {
            localStorage.removeItem(report)
        }
    }, [report])


    return (
        <AppModal show={report === "daily-inventory"} setshow={toggle} title={`REPORT: ${report.replaceAll("-", " ").toUpperCase()}`} full={true} >
            <div className="w-full h-[calc(100%-60px)] bg-gradient-to-b from-white to-gray-400 mb-2 flex flex-col pt-3">
                <form
                    onSubmit={getData}
                    className="flex flex-col gap-[5px] no-select"
                >
                    <label htmlFor="date">Report Filter:</label>
                    <div className="flex flex-wrap items-center gap-[10px]">
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="fr">Date:</label>
                            <input
                                type="date"
                                name="fr"
                                id="fr"
                                className="w-[250px] border-none"
                                value={filter.fr}
                                onChange={onChange}
                            />
                        </div>
                        <button type="submit">
                            <FunnelIcon
                                className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            />
                        </button>
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
            <div className="font-bold text-lg ml-auto"><span className="no-select mr-3">Total End Balance:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.remain) * amount(curr.price)), 0) || 0)}</div>
        </AppModal>
    )
}

export default TemplateDailyInventory