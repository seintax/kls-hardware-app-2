import React, { useEffect, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintReceivableCollection = () => {
    const reportname = "receivable-collection"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [total, settotal] = useState(0)
    const columns = {
        style: '',
        items: [
            { name: 'CR No.', stack: false, sort: 'crno' },
            { name: 'Customer', stack: true, sort: 'customer', size: 250 },
            { name: 'Amount', stack: true, sort: 'amount', size: 250 },
            { name: 'Mode of Payment', stack: true, sort: 'method', size: 250 },
            { name: 'Cheque', stack: true, sort: 'cheque', size: 250 },
            { name: 'Reference Date', stack: true, sort: 'date', size: 250 },
        ]
    }

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem(reportname))
        setprint(storage)
        setrecords(storage?.data)
        settotal(storage?.data.reduce((prev, curr) => prev + Number(curr?.items[2].value.replaceAll(",", "")), 0))
    }, [localStorage.getItem(reportname)])

    const trigger = () => {
        var css = '@page { size: landscape; }',
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
            <div className="w-full mt-5 font-bold">
                Total Collection: {currencyFormat.format(total)}
            </div>
        </div>
    )
}

export default PrintReceivableCollection