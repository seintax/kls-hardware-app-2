import React, { useEffect, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintDailyInventory = () => {
    const reportname = "daily-inventory"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [total, settotal] = useState(0)
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

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem(reportname))
        setprint(storage)
        setrecords(storage?.data)
        settotal(storage?.data.reduce((prev, curr) => prev + Number(curr?.items[9].value.replaceAll(",", "")), 0))
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
            <footer className="w-full mt-5 font-bold">
                Total End Balance: {currencyFormat.format(total)}
            </footer>
        </div>
    )
}

export default PrintDailyInventory