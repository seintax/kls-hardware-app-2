import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from '../../../utilities/interface/notification/notification.delete'
import { deleteSupplier } from "./supplier.services"

const SupplierRecords = ({ setter, manage, refetch, data }) => {
    const navigate = useNavigate()
    const { setSelected } = useClientContext()
    const [records, setrecords] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Supplier', stack: false, sort: 'name' },
            { name: 'Address', stack: true, sort: 'address', size: 450 },
            { name: 'Contact', stack: true, sort: 'contact', size: 200 },
            { name: 'Email', stack: true, sort: 'email', size: 200 },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const viewSupplier = (item) => {
        setSelected(prev => ({
            ...prev,
            supplier: { id: item.id, key: item.name }
        }))
        navigate(`/suppliers/${item.id}/view`)
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
            return await deleteSupplier(currentRecord?.id)
        }
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => viewSupplier(item), label: 'View' },
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: item.name },
            { value: item.address },
            { value: item.contact },
            { value: item.email },
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
            setstartpage(1)
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

export default SupplierRecords