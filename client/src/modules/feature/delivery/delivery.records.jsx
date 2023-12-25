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
import { deleteDelivery } from './delivery.services'

const DeliveryRecords = ({ setter, manage, refetch, data }) => {
    const navigate = useNavigate()
    const { search, setSelected } = useClientContext()
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
            { name: 'Delivery Info.', stack: true, sort: 'date', size: 200 },
            { name: 'DR No.', stack: true, sort: 'drno', size: 180 },
            { name: 'Supplier', stack: true, sort: 'name' },
            { name: 'No. of Items', stack: true, sort: 'count', size: 150 },
            { name: 'Value', stack: true, sort: 'count', size: 150 },
            { name: 'Remarks', stack: true, sort: 'remarks', size: 200 },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const viewDelivery = (item) => {
        setSelected(prev => ({
            ...prev,
            delivery: { id: item.id, key: `${item.name} (DR No. ${item.drno}-${moment(item.drdate).format("MM-DD-YYYY")})` }
        }))
        navigate(`/delivery/${item.id}/view`)
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
                    message: 'Cannot delete a delivery with existing stocks.',
                })
                return
            }
            return await deleteDelivery(currentRecord?.id)
        }
    }

    const actions = (item) => {
        return [
            // { type: 'link', link: `/delivery/${item.id}/view`, label: 'View' },
            { type: 'button', trigger: () => viewDelivery(item), label: 'View' },
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: moment(item.date).format("MM-DD-YYYY") },
            // {
            //     value: (
            //         <>
            //             <div>
            //                 {moment(item.date).format("MM-DD-YYYY")}
            //             </div>
            //             <div className="text-[10px]">DR No.: {item.drno}</div>
            //         </>
            //     )
            // },
            // {
            //     value: (
            //         <>
            //             <div>
            //                 {generateChar(item.drno.replaceAll("-", ""), "X", 20)}
            //             </div>
            //             <div className="text-[10px]">by: {item.name}</div>
            //         </>
            //     )
            // },
            { value: item.drno },
            { value: item.name },
            // {
            //     value: (
            //         <>
            //             <div>
            //                 {currencyFormat.format(item.value)}
            //             </div>
            //             <div className="text-[10px]">Count: {item.count}</div>
            //         </>
            //     )
            // },
            { value: item.count },
            { value: currencyFormat.format(item.value) },
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
                name={`DR NO. ${currentRecord?.drno} By ${currentRecord?.name}`}
                show={showDelete}
                setshow={setShowDelete}
                handleDelete={handleDelete}
                refetch={refetch}
            />
        </>
    )
}
export default DeliveryRecords