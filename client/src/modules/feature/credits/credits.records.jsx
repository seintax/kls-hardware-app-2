import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'

const CreditsRecords = ({ setter, manage, refetch, data }) => {
    const navigate = useNavigate()
    const { setSelected, clearSearchKey } = useClientContext()
    const [records, setrecords] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Customer', stack: false, sort: 'name' },
            { name: 'Address', stack: true, sort: 'address', size: 200 },
            { name: 'Contact', stack: true, sort: 'contact', size: 100 },
            { name: 'Email', stack: true, sort: 'email', size: 100 },
            { name: 'Transactions', stack: true, sort: 'count', size: 150 },
            { name: 'Credit Value', stack: true, sort: 'value', size: 150 },
            { name: 'Total Waived', stack: true, sort: 'waive', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const viewCreditor = (item) => {
        clearSearchKey()
        setSelected(prev => ({
            ...prev,
            credits: { id: item.id, key: item.name, total: item.value }
        }))
        navigate(`/credits/${item.id}/view`)
    }

    const viewSettled = (item) => {
        clearSearchKey()
        setSelected(prev => ({
            ...prev,
            credits: { id: item.id, key: item.name, total: item.value }
        }))
        navigate(`/credits/${item.id}/paid`)
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => viewCreditor(item), label: 'View' },
            { type: 'button', trigger: () => viewSettled(item), label: 'Logs' },
        ]
    }

    const items = (item) => {
        return [
            { value: item.name },
            { value: item.address },
            { value: item.contact },
            { value: item.email },
            { value: item.count },
            { value: currencyFormat.format(item.value) },
            { value: currencyFormat.format(item.waive) },
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
        </>
    )
}
export default CreditsRecords