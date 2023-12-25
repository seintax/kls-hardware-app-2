import React, { useEffect, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintInventory = () => {
    const reportname = "inventory"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [total, settotal] = useState(0)
    const columns = {
        style: '',
        items: [
            { name: 'Product Name', stack: false, sort: 'name' },
            { name: 'Supplier', stack: true, sort: 'supplier', size: 200 },
            { name: 'Delivery', stack: true, sort: 'drno', size: 160 },
            { name: 'Received/Cost', stack: true, sort: 'received', size: 130 },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 100 },
            { name: 'Price', stack: true, sort: 'price', size: 100 },
            { name: 'Vatable', stack: true, size: 50, position: "text-center" },
            { name: 'Divisible', stack: true, size: 50, position: "text-center" },
            { name: 'Sold', stack: true, size: 50 },
            { name: 'Transfer', stack: true, size: 50 },
            { name: 'Convert', stack: true, size: 50 },
        ]
    }

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem(reportname))
        setprint(storage)
        setrecords(storage?.data)
        settotal(storage?.data?.reduce((prev, curr) => prev + Number(curr?.items[4]?.value * curr?.items[5]?.value?.replaceAll(",", "")), 0))
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
                Total Value: {currencyFormat.format(total)}
            </div>
        </div>
    )
}

export default PrintInventory