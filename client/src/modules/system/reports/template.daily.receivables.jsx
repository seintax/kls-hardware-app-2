import { FunnelIcon, PrinterIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchDailyReceivables } from "./reports.services"

const TemplateDailyReceivables = ({ report, toggle }) => {
    const { setloading } = useClientContext()
    const [filter, setfilter] = useState({
        fr: moment(new Date()).format("YYYY-MM-DD"),
    })
    const [data, setdata] = useState([])

    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Customer', stack: false, sort: 'code' },
            { name: 'Balance', stack: true, sort: 'type', size: 250 },
        ]
    }

    const items = (item) => {
        return [
            { value: item.customer },
            { value: currencyFormat.format(Number(item.balance).toFixed(2)) },
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

    const getData = async (e) => {
        e.preventDefault()
        setloading(true)
        let res = await fetchDailyReceivables()
        setdata(res?.result)
        setloading(false)
    }

    const printData = () => {
        localStorage.setItem(report, JSON.stringify({
            title: "DAILY RECEIVABLES REPORT",
            subtext: `As of: ${moment(filter.fr).format("MMMM DD, YYYY")}`,
            data: records
        }))
        window.open(`/#/print/${report}/${moment(filter.fr).format("MMDDYYYYHHmmss")}`, '_blank')
    }

    useEffect(() => {
        return () => {
            localStorage.removeItem(report)
        }
    }, [report])


    return (
        <AppModal show={report === "daily-receivables"} setshow={toggle} title={`REPORT: ${report.replaceAll("-", " ").toUpperCase()}`} full={true} >
            <div className="w-full h-[calc(100%-60px)] bg-gradient-to-b from-white to-gray-400 mb-2 flex flex-col pt-3">
                <form
                    onSubmit={getData}
                    className="flex flex-col gap-[5px] no-select"
                >
                    <label htmlFor="date">Report Filter:</label>
                    <div className="flex flex-wrap items-center gap-[10px]">
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="fr">As of:</label>
                            <input
                                type="date"
                                name="fr"
                                id="fr"
                                className="w-[250px] border-none"
                                disabled={true}
                                value={filter.fr}
                            />
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
            <div className="font-bold text-lg ml-auto"><span className="no-select mr-3">Total Receivables:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + Number(curr.balance.toFixed(2)), 0) || 0)}</div>
        </AppModal>
    )
}

export default TemplateDailyReceivables