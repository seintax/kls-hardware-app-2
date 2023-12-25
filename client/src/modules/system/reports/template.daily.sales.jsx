import { FunnelIcon, PrinterIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchDailySales } from "./reports.services"

const TemplateDailySales = ({ report, toggle }) => {
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
            { name: 'Type', stack: true, sort: 'type', size: 250 },
            { name: 'Amount', stack: true, sort: 'amount', size: 250 },
            { name: 'Mode of Payment', stack: true, sort: 'method', size: 250 },
            { name: 'Cheque', stack: true, sort: 'cheque', size: 250 },
            { name: 'Reference Date', stack: true, sort: 'date', size: 250 },
        ]
    }

    const formatReference = (item) => {
        if (item.method === "CASH") return ""
        if (item.method === "GCASH") return `REF#${item.cheque}`
        if (item.method === "CHEQUE") return item.cheque
    }

    const items = (item) => {
        return [
            { value: filter.type === "CODE" ? item.code : item.receipt },
            { value: item.type },
            { value: currencyFormat.format(Number(item.amount).toFixed(2)) },
            { value: item.method },
            { value: formatReference(item) },
            { value: item.date ? moment(item.date).format("MM-DD-YYYY") : "" },
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
            to: value,
        }))
    }

    const onTypeChange = (e) => {
        const { value } = e.target
        setfilter(prev => ({
            ...prev,
            type: value,
        }))
    }

    const getData = async (e) => {
        e.preventDefault()
        setloading(true)
        let res = await fetchDailySales(moment(filter.fr).format("YYYY-MM-DD"), moment(filter.to).format("YYYY-MM-DD"))
        setdata(res?.result)
        setloading(false)
    }

    const printData = () => {
        localStorage.setItem(report, JSON.stringify({
            title: "DAILY SALES REPORT",
            subtext: `From: ${moment(filter.fr).format("MMMM DD, YYYY")} To: ${moment(filter.to).format("MMMM DD, YYYY")}`,
            data: records
        }))
        window.open(`/#/print/${report}/${moment(filter.fr).format("MMDDYYYY")}${moment(filter.to).format("MMDDYYYY")}`, '_blank')
    }

    useEffect(() => {
        return () => {
            localStorage.removeItem(report)
        }
    }, [report])


    return (
        <AppModal show={report === "daily-sales"} setshow={toggle} title={`REPORT: ${report.replaceAll("-", " ").toUpperCase()}`} full={true} >
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
                        {/* <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="to">To:</label>
                            <input
                                type="date"
                                name="to"
                                id="to"
                                className="w-[250px] border-none"
                                value={filter.to}
                                onChange={onChange}
                            />
                        </div> */}
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="type"></label>
                            <select
                                name="type"
                                id="type"
                                className="w-[250px] border-none"
                                value={filter.type}
                                onChange={onTypeChange}
                            >
                                <option value="TYPE">By Receipt Type</option>
                                <option value="CODE">By Transaction Code</option>
                            </select>
                        </div>
                        <button type="submit">
                            <FunnelIcon
                                className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            />
                        </button>
                        <PrinterIcon
                            className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer ml-auto"
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
            <div className="font-bold text-lg ml-auto"><span className="no-select mr-3">Total Sales:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + Number(curr.amount.toFixed(2)), 0) || 0)}</div>
        </AppModal>
    )
}

export default TemplateDailySales