import { FunnelIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { OnViewer } from "../viewer/viewer.index"
import { fetchTransactionByLogged, fetchTransactionBySlipno } from "./cashering.service"

const CasheringLogged = ({ show, toggle, user, openTransaction }) => {
    const { setloading } = useClientContext()
    const [datefr, setdatefr] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [dateto, setdateto] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [code, setcode] = useState("")
    const [data, setdata] = useState([])
    const defaultCashier = 4

    const [records, setrecords] = useState()
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Transaction', stack: false, sort: 'code' },
            { name: 'Order', stack: true, sort: 'ordno', size: 150 },
            { name: 'Logged', stack: true, sort: 'time', size: 150 },
            { name: 'Total', stack: true, sort: 'total', size: 100 },
            { name: 'Discount', stack: true, sort: 'less', size: 100 },
            { name: 'Net Amount', stack: true, sort: 'net', size: 150 },
            { name: 'Tended', stack: true, sort: 'tended', size: 100 },
            { name: 'Change', stack: true, sort: 'loose', size: 100 },
            { name: 'Method', stack: true, sort: 'method', size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 100 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const toggleDelete = (record) => {
        setCurrentRecord(record)
        setShowDelete(true)
    }

    const toggleOpen = async (item) => {
        let transaction = await openTransaction(item)
        if (transaction) toggle()
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleOpen(item), label: 'Open' },
            // { type: 'button', trigger: () => toggleDelete(item), label: 'Cancel' }
        ]
    }

    const items = (item) => {
        return [
            { value: <OnViewer id={item.code} /> },
            { value: item.ordno },
            { value: moment(item.time).format("MM-DD-YYYY") },
            { value: currencyFormat.format(item.total) },
            { value: currencyFormat.format(item.less) },
            { value: currencyFormat.format(item.net) },
            { value: currencyFormat.format(item.tended) },
            { value: currencyFormat.format(item.loose) },
            { value: item.method ? item.method : item.status },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    ondoubleclick: () => rowSelect(item),
                    items: items(item)
                }
            }))
        }
    }, [data, sorted])

    const onChange = (e) => {
        const { name, value } = e.target
        if (name === "code") setcode(value)
        if (name === "datefr") setdatefr(value)
        if (name === "dateto") setdateto(value)
    }

    const getData = async () => {
        setloading(true)
        setdata()
        setstartpage(1)
        if (code.startsWith("!")) {
            let res = await fetchTransactionBySlipno(user?.name === "DEVELOPER" ? defaultCashier : user?.id, code.replace("!", ""))
            if (res?.result?.length) setdata(res?.result)
        }
        else {
            let res = await fetchTransactionByLogged(moment(datefr).format("YYYY-MM-DD"), moment(dateto).format("YYYY-MM-DD"), user?.name === "DEVELOPER" ? defaultCashier : user?.id, code)
            if (res?.result?.length) setdata(res?.result)
        }
        setloading(false)
    }

    return (
        <AppModal show={show} setshow={toggle} title="Cashering Transactions">
            <div className="w-[95vw] h-[85vh] flex flex-col py-3">
                <div className="flex flex-col gap-[5px]">
                    <label htmlFor="date">Sales Date:</label>
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="date"
                            name="datefr"
                            id="datefr"
                            className="w-[250px]"
                            value={datefr}
                            onChange={onChange}
                        />
                        <input
                            type="date"
                            name="dateto"
                            id="dateto"
                            className="w-[250px]"
                            value={dateto}
                            onChange={onChange}
                        />
                        <input
                            type="search"
                            name="code"
                            id="code"
                            className="w-[350px]"
                            value={code}
                            onChange={onChange}
                        />
                        <button type="submit">
                            <FunnelIcon
                                className="h-10 w-10 text-gray-700 hover:text-gray-500 cursor-pointer"
                                onClick={() => getData()}
                            />
                        </button>
                    </div>
                </div>
                <DataRecords
                    columns={columns}
                    records={records}
                    page={startpage}
                    setPage={setstartpage}
                    itemsperpage={itemsperpage}
                    setsorted={setsorted}
                />
            </div>
        </AppModal>
    )
}

export default CasheringLogged