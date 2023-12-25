import { PrinterIcon } from "@heroicons/react/20/solid"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useClientContext } from '../../../utilities/context/client.context'
import MonitorRecords from './monitor.records'
import { fetchPaymentByCheque } from './monitor.services'

const MonitorIndex = () => {
    const { search } = useClientContext()
    const name = 'Monitor'
    const { data, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchPaymentByCheque())
    const [manage, setManage] = useState(false)
    const [printable, setprintable] = useState()
    const [id, setId] = useState()
    const [monitor, setmonitor] = useState({
        claimable: 0,
        today: 0,
        expired: 0
    })

    useEffect(() => { refetch() }, [search])

    useEffect(() => {
        const timeDurationInDays = (beg, end) => {
            var diff = (end - beg) / 1000
            diff /= (60 * 60) * 24
            return Math.round(diff)
        }
        if (data?.result) {
            let result = data?.result?.map(data => {
                let beg = (new Date()).getTime()
                let end = new Date(data.refdate).getTime()
                return {
                    claimable: timeDurationInDays(beg, end) > 0 ? 1 : 0,
                    today: timeDurationInDays(beg, end) === 0 ? 1 : 0,
                    expired: timeDurationInDays(beg, end) < 0 ? 1 : 0
                }
            })
            let claimable = result.reduce((prev, curr) => prev + Number(curr.claimable), 0)
            let today = result.reduce((prev, curr) => prev + Number(curr.today), 0)
            let expired = result.reduce((prev, curr) => prev + Number(curr.expired), 0)
            setmonitor({
                claimable: claimable,
                today: today,
                expired: expired
            })
        }
    }, [data?.result])

    const printData = async () => {
        let asOf = new Date()
        localStorage.setItem("cheque-monitor", JSON.stringify({
            title: "CHEQUE MONITOR REPORT",
            subtext: `as of ${moment(asOf).format("MM-DD-YYYY hh:mm:ss A")}`,
            data: printable
        }))
        window.open(`/#/print/cheque-monitor/${moment(asOf).format("MMDDYYYYHHmmss")}`, '_blank')
    }

    return (
        <div className="flex flex-col py-6 px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex sm:items-center justify-between">
                <div className="sm:flex-auto no-select">
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">{name.toUpperCase()}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all entries registered in the system.
                    </p>
                </div>
                <div className="text-sm flex gap-2 text-white">
                    <button className="button-link" onClick={() => printData()}>
                        <PrinterIcon className="w-5 h-5 text-white" />
                    </button>
                    <span className="py-2 px-3 rounded-md bg-blue-600">
                        Claimable: {monitor?.claimable}
                    </span>
                    <span className="py-2 px-3 rounded-md bg-orange-600">
                        Today: {monitor?.today}
                    </span>
                    <span className="py-2 px-3 rounded-md bg-red-600">
                        Lapsed: {monitor?.expired}
                    </span>
                </div>
            </div>
            <MonitorRecords
                setter={setId}
                manage={setManage}
                refetch={refetch}
                data={data?.result || []}
                setprintable={setprintable}
            />
        </div>
    )
}

export default MonitorIndex