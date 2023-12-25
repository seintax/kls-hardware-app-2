import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from '../../../utilities/interface/notification/notification.delete'
import { deleteTransfer } from './transfer.services'

const TransferRecords = ({ setter, manage, refetch, data }) => {
    const navigate = useNavigate()
    const { setSelected } = useClientContext()
    const { handleNotification } = useNotificationContext()
    const [records, setrecords] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Transfer Info.', stack: true, sort: 'date', size: 200 },
            // { name: 'TR No.', stack: true, sort: 'trno', size: 150 },
            // { name: 'Transfer Value', stack: true, sort: 'value', size: 180 },
            // { name: 'No. of Items', stack: true, sort: 'count', size: 150 },
            { name: 'Details', stack: true, sort: 'count', size: 200 },
            { name: 'Delivered to', stack: false, sort: 'name' },
            { name: 'Remarks', stack: true, sort: 'remarks', size: 300 },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const viewDelivery = (item) => {
        setSelected(prev => ({
            ...prev,
            transfer: { id: item.id, key: `${item.trno}-${moment(item.date).format("MM-DD-YYYY")}` }
        }))
        navigate(`/transfer/${item.id}/view`)
    }

    const toggleDelete = (record) => {
        setCurrentRecord(record)
        setShowDelete(true)
    }

    const toggleEdit = (item) => {
        setter(item.id)
        manage(true)
    }

    const handleDelete = async () => {
        if (currentRecord) {
            if (currentRecord.count > 0) {
                handleNotification({
                    type: 'error',
                    message: 'Cannot delete a transfer record with existing content.',
                })
                return
            }
            return await deleteTransfer(currentRecord?.id)
        }
    }

    const actions = (item) => {
        return [
            // { type: 'link', link: `/transfer/${item.id}/view`, label: 'View' },
            { type: 'button', trigger: () => viewDelivery(item), label: 'View' },
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            // { value: moment(item.date).format("MM-DD-YYYY") },
            {
                value: (
                    <>
                        <div>
                            {moment(item.date).format("MM-DD-YYYY")}
                        </div>
                        <div className="text-[10px]">TR No.: {item.trno}</div>
                    </>
                )
            },
            // { value: item.trno },
            // { value: currencyFormat.format(item.value) },
            // { value: item.count },
            {
                value: (
                    <>
                        <div>
                            {currencyFormat.format(item.value)}
                        </div>
                        <div className="text-[10px]">Count: {item.count}</div>
                    </>
                )
            },
            { value: item.name },
            { value: item.remarks },
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
            <NotificationDelete
                name={`TR No. ${currentRecord?.trno}`}
                show={showDelete}
                setshow={setShowDelete}
                handleDelete={handleDelete}
                refetch={refetch}
            />
        </>
    )
}
export default TransferRecords