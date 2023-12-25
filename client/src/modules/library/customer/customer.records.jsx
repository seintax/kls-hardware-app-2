import React, { useEffect, useState } from 'react'
import { sortBy } from '../../../utilities/functions/array.functions'
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from '../../../utilities/interface/notification/notification.delete'
import { deleteCustomer } from './customer.services'

const CustomerRecords = ({ setter, manage, refetch, data }) => {
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
            { name: 'Address', stack: true, sort: 'address', size: 300 },
            { name: 'Contact', stack: true, sort: 'contact', size: 100 },
            { name: 'Email', stack: true, sort: 'email', size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

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
            return await deleteCustomer(currentRecord?.id)
        }
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: item.name },
            { value: item.address ? item.address : "-" },
            { value: item.contact ? item.contact : "-" },
            { value: item.email ? item.email : "-" },
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
                name={currentRecord?.name}
                show={showDelete}
                setshow={setShowDelete}
                handleDelete={handleDelete}
                refetch={refetch}
            />
        </>
    )
}
export default CustomerRecords