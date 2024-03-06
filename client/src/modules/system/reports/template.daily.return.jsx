import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline"
import { FunnelIcon, PrinterIcon } from "@heroicons/react/24/solid"
import { saveAs } from 'file-saver'
import moment from "moment"
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchDailyReturn } from "./reports.services"

const TemplateDailyReturn = ({ report, toggle }) => {
    const { setloading } = useClientContext()
    const [filter, setfilter] = useState({
        fr: moment(new Date()).format("YYYY-MM-DD"),
        to: moment(new Date()).format("YYYY-MM-DD"),
        type: "TYPE"
    })
    const [data, setdata] = useState([])

    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Particulars', stack: false, sort: 'code' },
            { name: 'Receipt', stack: false, sort: 'receipt', size: 250 },
            { name: 'Date/Time', stack: true, sort: 'time', size: 250 },
            { name: 'Processed by', stack: true, sort: 'user', size: 250 },
            { name: 'Original Amt', stack: true, sort: 'p_net', size: 150 },
            { name: 'Return Amt', stack: true, sort: 'r_net', size: 150 },
        ]
    }

    const items = (item) => {
        return [
            { value: item.code },
            { value: item.receipt },
            { value: moment(item.time).format("MM-DD-YYYY hh:mm:ss A") },
            { value: item.user },
            { value: currencyFormat.format(amount(item.p_net)) },
            { value: currencyFormat.format(amount(item.r_net)) },
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
        const { name, value } = e.target
        setfilter(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const getData = async (e) => {
        e.preventDefault()
        setloading(true)
        let res = await fetchDailyReturn(moment(filter.fr).format("YYYY-MM-DD"), moment(filter.to).format("YYYY-MM-DD"))
        setdata(res?.result)
        setloading(false)
    }

    const printData = () => {
        localStorage.setItem(report, JSON.stringify({
            title: "DAILY RETURN REPORT",
            subtext: `From: ${moment(filter.fr).format("MMMM DD, YYYY")} To: ${moment(filter.to).format("MMMM DD, YYYY")}`,
            data: records
        }))
        window.open(`/#/print/${report}/${moment(filter.fr).format("MMDDYYYY")}${moment(filter.to).format("MMDDYYYY")}`, '_blank')
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
        return () => {
            localStorage.removeItem(report)
        }
    }, [report])


    return (
        <AppModal show={report === "daily-return"} setshow={toggle} title={`REPORT: ${report.replaceAll("-", " ").toUpperCase()}`} full={true} >
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
            <div className="font-bold text-lg ml-auto"><span className="no-select mr-3">Total Returns:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.r_net), 0) || 0)}</div>
        </AppModal>
    )
}

export default TemplateDailyReturn