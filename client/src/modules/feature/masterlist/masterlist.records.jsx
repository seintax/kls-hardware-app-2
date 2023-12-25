import React, { useEffect, useState } from 'react'
import { sortBy } from '../../../utilities/functions/array.functions'
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from '../../../utilities/interface/notification/notification.delete'
import { deleteMasterlist } from './masterlist.services'

const MasterlistRecords = ({ setter, manage, refetch, data }) => {
    const [records, setrecords] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Masterlist', stack: false, sort: 'name' },
            { name: 'Description', stack: true, sort: 'details', size: 300 },
            // { name: 'Unit', stack: true, sort: 'unit', size: 150 },
            // { name: 'Category', stack: true, sort: 'category', size: 150 },
            { name: 'Receipt Display', stack: true, sort: 'receipt', size: 200 },
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
            return await deleteMasterlist(currentRecord?.id)
        }
    }

    const actions = (item) => {
        return [
            // { type: 'link', link: `/masterlist`, label: 'View' },
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            // { value: item.name },
            {
                value: (
                    <>
                        <div>
                            {item.name}
                        </div>
                        <div className="text-[10px]">{item.category}</div>
                    </>
                )
            },
            // { value: item.details },
            {
                value: (
                    <>
                        <div>
                            {item.details}
                        </div>
                        <div className="text-[10px]">Unit: {item.unit}</div>
                    </>
                )
            },
            {
                value: (
                    <>
                        <div>
                            {item.receipt}
                        </div>
                        <div className="text-[10px]">SKU: {item.sku}</div>
                    </>
                )
            },
            // { value: item.unit },
            // { value: item.category },
            // { value: item.receipt },

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
    },
        [data, sorted])

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
export default MasterlistRecords