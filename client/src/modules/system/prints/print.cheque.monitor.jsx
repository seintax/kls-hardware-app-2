import React, { useEffect, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintChequeMonitor = () => {
    const reportname = "cheque-monitor"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [expired, setexpired] = useState(0)
    const [total, settotal] = useState(0)
    const columns = {
        style: '',
        items: [
            { name: 'Transaction', stack: false, sort: 'code' },
            { name: 'Cheque No.', stack: true, sort: 'refcode', size: 150 },
            { name: 'Cheque Date', stack: true, sort: 'refdate', size: 250 },
            { name: 'Amount', stack: true, sort: 'amount', size: 120 },
            { name: 'Type', stack: true, sort: 'type', size: 120 },
            { name: 'Expiration', stack: true, size: 150 },
            { name: 'Status', stack: true, sort: 'refstat', size: 100 },
        ]
    }

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem(reportname))
        setprint(storage)
        setrecords(storage?.data)
        settotal(storage?.data?.reduce((prev, curr) => prev + Number(curr?.items[5]?.value?.startsWith("-") ? 0 : Number(curr?.items[3]?.value.replaceAll(",", ""))), 0))
        setexpired(storage?.data?.reduce((prev, curr) => prev + Number(curr?.items[5]?.value?.startsWith("-") ? Number(curr?.items[3]?.value.replaceAll(",", "")) : 0), 0))
    }, [localStorage.getItem(reportname)])

    const trigger = () => {
        var css = '@page { size: portrait; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style')

        style.type = 'text/css'
        style.media = 'print'

        if (style.styleSheet) {
            style.styleSheet.cssText = css
        } else {
            style.appendChild(document.createTextNode(css))
        }

        head.appendChild(style)
        // window.print()
    }

    const header = () => {
        return (
            <div className="w-full flex flex-col gap-[5px] mb-2 items-center">
                <div className="font-bold">{print?.title}</div>
                <div className="text-sm">{print?.subtext}</div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-start bg-white">
            <div className="w-full text-center">
                <AppLogo style="h-[100px]" />
            </div>
            <DataPrint
                columns={columns}
                records={records}
                header={header}
                trigger={trigger}
            />
            <div className="w-full mt-5 font-bold flex gap-10">
                <span>Total Claimable: {currencyFormat.format(total)}</span>
                <span>Total Expired: {currencyFormat.format(expired)}</span>
            </div>
        </div>
    )
}

export default PrintChequeMonitor