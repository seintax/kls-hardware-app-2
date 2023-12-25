import React, { useEffect, useState } from 'react'
import { sortBy } from '../../../utilities/functions/array.functions'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import RequestReturn from "./request.returns"

const RequestRecords = ({ setter, manage, refetch, data }) => {
    const [records, setrecords] = useState()
    const [showreturn, setshowreturn] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Transaction', stack: false, sort: 'code' },
            { name: 'Total Amount', stack: true, sort: 'prevnet', size: 180 },
            { name: 'Return Amount', stack: true, sort: 'rtrnnet', size: 180 },
            { name: 'Remaining Net', stack: true, size: 180 },
            { name: 'Requested by', stack: true, sort: 'requestedby', size: 200 },
            { name: 'Status', stack: true, sort: 'status', size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 150 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const viewRequest = (item) => {
        setCurrentRecord(item)
        setshowreturn(true)
    }

    const closeRequest = () => {
        setshowreturn(false)
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => viewRequest(item), label: 'View Request' }
        ]
    }

    const items = (item) => {
        return [
            { value: item.code },
            { value: currencyFormat.format(item.prevnet) },
            { value: currencyFormat.format(item.rtrnnet) },
            {
                value: <span className="text-blue-600">
                    {currencyFormat.format(Number(item.prevnet) - Number(item.rtrnnet))}
                </span>
            },
            { value: item.requestedby ? item.requestedby : "Administrator" },
            { value: item.status },
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

    return (
        <>
            <DataRecords
                columns={columns}
                records={records}
                page={startpage}
                setPage={setstartpage}
                itemsperpage={itemsperpage}
                setsorted={setsorted}
            />
            <RequestReturn
                show={showreturn}
                toggle={closeRequest}
                request={currentRecord}
            />
        </>
    )
}
export default RequestRecords