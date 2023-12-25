import React, { useEffect, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintDailySales = () => {
    const reportname = "daily-sales"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [total, settotal] = useState(0)
    const columns = {
        style: '',
        items: [
            { name: 'Particulars', stack: false, sort: 'code' },
            { name: 'Type', stack: true, sort: 'type', size: 250, position: "text-center" },
            { name: 'Amount', stack: true, sort: 'amount', size: 250, position: "text-center" },
            { name: 'Method', stack: true, sort: 'method', size: 250, position: "text-center" },
            { name: 'Cheque', stack: true, sort: 'cheque', size: 250, position: "text-center" },
            { name: 'Date', stack: true, sort: 'date', size: 250, position: "text-center" },
        ]
    }

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem(reportname))
        setprint(storage)
        setrecords(storage?.data)
        settotal(storage?.data.reduce((prev, curr) => prev + Number(curr?.items[2].value.replaceAll(",", "")), 0))
    }, [localStorage.getItem(reportname)])

    const trigger = () => {
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
            <footer className="w-full mt-5 font-bold">
                Total Sales: {currencyFormat.format(total)}
            </footer>
        </div>
    )
}

export default PrintDailySales