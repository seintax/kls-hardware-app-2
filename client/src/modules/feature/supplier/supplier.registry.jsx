import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery } from "react-query"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataError from "../../../utilities/interface/datastack/data.error"
import DataLoading from "../../../utilities/interface/datastack/data.loading"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from "../../../utilities/interface/notification/notification.delete"
import DeliveryManage from "../delivery/delivery.manage"
import { deleteDelivery, fetchDeliveryById, fetchDeliveryBySupplier } from "../delivery/delivery.services"

const SupplierRegistry = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const name = ""
    const { id } = useParams()
    const { handleTrail, selected, setSelected } = useClientContext()
    const { data, isLoading, isError, refetch } = useQuery(name, () => fetchDeliveryBySupplier(id))
    const [records, setrecords] = useState()
    const [information, setinformation] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [currentRecord, setCurrentRecord] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Date Delivered', stack: true, sort: 'date', size: 200 },
            { name: 'DR No.', stack: true, sort: 'drno', size: 150 },
            { name: 'Supplier', stack: false, sort: 'supplier' },
            { name: 'Remarks', stack: true, sort: 'remarks', size: 300 },
            { name: 'Delivery Value', stack: true, sort: 'value', size: 180 },
            { name: 'No. of Items', stack: true, sort: 'count', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    const rowSelect = (record) => setCurrentRecord(record)

    const viewDelivery = (item) => {
        setSelected(prev => ({
            ...prev,
            supplier: {
                ...prev.supplier,
                dr: item,
                display: `${prev.supplier.key} (DR NO. ${item.drno}-${moment(item.drdate).format("MM-DD-YYYY")})`
            }
        }))
        navigate(`/suppliers/${item.id}/delivery`)
    }

    const toggleDelete = (record) => {
        setCurrentRecord(record)
        setShowDelete(true)
    }

    const toggleEdit = (item) => {
        if (item.received !== item.stocks) {
            alert("Cannot edit items that has existing sales record.")
            return
        }
        setCurrentRecord(item)
        setShowEdit(true)
    }

    const toggleDelivery = () => {
        setCurrentRecord()
        setShowEdit(true)
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
            { type: 'button', trigger: () => viewDelivery(item), label: 'View' },
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: moment(item.date).format("MM-DD-YYYY") },
            { value: item.drno },
            { value: item.name },
            { value: item.remarks },
            { value: currencyFormat.format(item.value) },
            { value: item.count },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        const instantiate = async () => {
            const info = await fetchDeliveryById(id)
            setinformation(info.result)
        }

        instantiate()
    }, [id])

    useEffect(() => {
        if (data?.result?.length) {
            let tempdata = sorted ? sortBy(data?.result, sorted) : data?.result
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    ondoubleclick: () => rowSelect(item),
                    items: items(item)
                }
            }))
        }
        else setrecords([])
    }, [data, sorted])

    return (
        (showEdit) ?
            <DeliveryManage
                id={currentRecord?.id}
                name={name}
                manage={setShowEdit}
            /> : (
                <div className="p-6">
                    <div className="w-full flex justify-between mb-[-5px]">
                        <div className="flex gap-[20px] items-center">
                            <Link to="/suppliers" className="button-static">
                                Back to Previous List
                            </Link>
                            <span className="text-sm">
                                Supplier:
                                <b className="ml-3">
                                    {selected?.supplier?.key}
                                </b>
                            </span>
                        </div>
                        <button className="button-link" onClick={() => toggleDelivery()}>
                            Add Delivery
                        </button>
                    </div>
                    <DataRecords
                        columns={columns}
                        records={records}
                        page={startpage}
                        setPage={setstartpage}
                        itemsperpage={itemsperpage}
                        setsorted={setsorted}
                    />
                    {(isLoading && (<DataLoading />))}
                    {(isError && (<DataError />))}
                    <NotificationDelete
                        name={`DR NO. ${currentRecord?.drno}`}
                        show={showDelete}
                        setshow={setShowDelete}
                        handleDelete={handleDelete}
                        refetch={refetch}
                    />
                </div>
            )
    )
}
export default SupplierRegistry