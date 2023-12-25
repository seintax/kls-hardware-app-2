import React, { useEffect, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintDeliveryPayables = () => {
    const reportname = "delivery-payables"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [total, settotal] = useState(0)
    const columns = {
        style: '',
        items: [
            { name: 'Product Name', stack: false, sort: 'name' },
            { name: 'Quantity', stack: true, sort: 'received', size: 200 },
            { name: 'Price', stack: true, sort: 'price', size: 200 },
            { name: 'Value', stack: true, size: 200 },
        ]
    }

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem(reportname))
        setprint(storage)
        setrecords(storage?.data)
        settotal(storage?.data?.reduce((prev, curr) => prev + Number(curr?.items[1]?.value * curr?.items[2]?.value?.replaceAll(",", "")), 0))
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
            <div className="w-full mt-5 font-bold">
                Total Payables: {currencyFormat.format(total)}
            </div>
        </div>
    )
}

export default PrintDeliveryPayables