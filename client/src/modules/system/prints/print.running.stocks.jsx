import React, { useEffect, useState } from 'react'
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintRunningStocks = () => {
    const reportname = "running-stocks"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [total, settotal] = useState(0)
    const [collection, setcollection] = useState(0)
    const [summary, setsummary] = useState()
    const columns = {
        style: '',
        items: [
            { name: 'Item name', stack: false, sort: 'date' },
            { name: 'Total Delivery', stack: true, sort: 'delivered', size: 250 },
            { name: 'Total Sold', stack: true, sort: 'dispensed', size: 250 },
            { name: 'Total Transfer', stack: true, sort: 'transfered', size: 250 },
            { name: 'Total Converted', stack: true, sort: 'converted', size: 250 },
            { name: 'Balance', stack: true, sort: 'balance', size: 250 },
        ]
    }

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem(reportname))
        setprint(storage)
        setrecords(storage?.data)
        setsummary(storage?.summary)
    }, [localStorage.getItem(reportname)])

    const trigger = () => {
        var css = '@page { size: portait; }',
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

    const heading = () => {
        return (
            <tr className="bg-gray-200 backdrop-blur py-3.5 px-1 text-left text-xs font-semibold text-gray-900 w-[50px] bg-gray-200">
                <td colSpan={2} className=" py-3 border border-1 border-gray-300"></td>
                <td colSpan={5} className="text-center py-3 border border-1 border-gray-300">SALES</td>
                <td colSpan={4} className="text-center py-3 border border-1 border-gray-300">COLLECTION</td>
            </tr>
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
                summary={summary}
            />
            {/* <div className="w-full mt-5 font-bold flex gap-5">
                <span>Total Sales: {currencyFormat.format(total)}</span>
                <span>Total Collection: {currencyFormat.format(collection)}</span>
            </div> */}
        </div>
    )
}

export default PrintRunningStocks