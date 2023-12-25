import { XMarkIcon } from "@heroicons/react/20/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from "react-query"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { generateZeros } from "../../../utilities/functions/string.functions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import NotificationDelete from "../../../utilities/interface/notification/notification.delete"
import { deleteShift, fetchShiftByAccount, fetchTransactionBySchedule, updateShift } from "./cashering.service"

const CasheringSchedule = ({ show, toggle }) => {
    const { user, cache, setcache } = useClientContext()
    const { handleNotification } = useNotificationContext()
    const name = "schedule-index"
    const { data, isLoading, isError, refetch } = useQuery(name, () => fetchShiftByAccount(user.id))
    const queryClient = useQueryClient()
    const [records, setrecords] = useState()
    const [currentRecord, setCurrentRecord] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const [fortransfer, setfortransfer] = useState()
    const [currtransfer, setcurrtransfer] = useState()
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Shift Code', stack: false, sort: 'id' },
            { name: 'Start', stack: true, sort: 'begstart', size: 200 },
            { name: 'Status', stack: true, sort: 'status', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 100 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const toggleTransfer = async (record) => {
        setCurrentRecord(record)
        let res = await fetchTransactionBySchedule(record.id)
        if (res?.result?.length) {
            setfortransfer(res?.result)
            setcurrtransfer(record)
            return
        }
        handleNotification({
            type: 'error',
            message: `This schedule does not have a transaction.`
        })
    }

    const toggleMove = async (record) => {
        alert("sorry this option is still under experimental testing...")
        // let fr = generateZeros(currtransfer.id, 5)
        // let to = generateZeros(record.id, 6)
        // if (window.confirm(`Are you sure you want to move ${fortransfer.length} transaction(s) from #${fr} to #${to}?`)) {
        //     if (!window.confirm("This procedure is unstable and may cause data lose and other errors.\nDo you wish to proceed?")) return
        //     setCurrentRecord(record)
        //     let batch = fortransfer?.map(trn => {
        //         let sought = `-${generateZeros(currtransfer.id, 5)}-`
        //         let newcode = `-${generateZeros(record.id, 5)}-`
        //         return {
        //             sfr: currtransfer.id,
        //             sto: record.id,
        //             old: trn.code,
        //             new: trn.code.replace(sought, newcode)
        //         }
        //     })
        //     let param = {
        //         trans: batch
        //     }
        //     let res = await transferShift(param)
        //     if (res?.success) {
        //         if (res?.result?.errors > 0) {
        //             handleNotification({
        //                 type: 'error',
        //                 message: `${res?.result?.errors} has been found during transfer.`
        //             })
        //             return
        //         }
        //         handleNotification({
        //             type: 'success',
        //             message: `Successfully transfered selected transactions to #${to}.`
        //         })
        //         setfortransfer()
        //         setCurrentRecord()
        //         setcurrtransfer()
        //     }
        // }
    }

    const toggleClose = async (record) => {
        if (window.confirm(`Are you sure you want to close #${generateZeros(record.id, 5)}?`)) {
            setCurrentRecord(record)
            let param = {
                status: "CLOSE",
                id: record.id
            }
            let resShift = await updateShift(param)
            if (resShift.success) {
                setcache(prev => ({
                    ...prev,
                    schedule: [...prev.schedule?.filter(f => f !== record.id), record.id]
                }))
                handleNotification({
                    type: 'success',
                    message: `Successfully closed schedule #${generateZeros(record.id, 5)}.`
                })
                queryClient.invalidateQueries(name)
            }
        }
    }

    const toggleStart = async (record) => {
        if (window.confirm(`Are you sure you want to undo #${generateZeros(record.id, 5)}?`)) {
            setCurrentRecord(record)
            let param = {
                status: "START",
                id: record.id
            }
            let resShift = await updateShift(param)
            if (resShift.success) {
                setcache(prev => ({
                    ...prev,
                    schedule: [...prev.schedule?.filter(f => f !== record.id)]
                }))
                handleNotification({
                    type: 'success',
                    message: `Successfully undone schedule #${generateZeros(record.id, 5)}.`
                })
                queryClient.invalidateQueries(name)
            }
        }
    }

    const toggleDelete = async (record) => {
        let res = await fetchTransactionBySchedule(record.id)
        if (res?.result?.length) {
            handleNotification({
                type: 'error',
                message: `Cannot delete schedule with ${res?.result?.length} recorded transactions.`
            })
            return
        }
        setCurrentRecord(record)
        setShowDelete(true)
    }

    const handleDelete = async () => {
        if (currentRecord) {
            return await deleteShift(currentRecord?.id)
        }
    }

    const movable = (item, fortrans, record) => {
        if (!fortrans || (fortrans && item.id === record?.id)) return true
        return false
    }

    const transferable = (fortrans) => {
        if (fortrans?.length > 0) return true
        return false
    }

    const deletable = (fortrans) => {
        if (fortrans?.length > 0) return true
        return false
    }

    const undoable = (item, cache) => {
        if ((!cache?.schedule?.includes(item.id) && item.status === "CLOSE") || item.status === "START") return true
        return false
    }

    const actions = (item, cache) => {
        return [
            // { type: 'button', trigger: () => toggleMove(item), label: 'Move to', hidden: movable(item, fortrans, record) },
            // { type: 'button', trigger: () => toggleTransfer(item), label: 'Transfer', hidden: transferable(fortrans) },
            // { type: 'button', trigger: () => toggleDelete(item), label: 'Close', hidden: deletable(fortrans) }
            // { type: 'button', trigger: () => toggleDelete(item), label: 'Delete', hidden: deletable(fortrans) }
            { type: 'button', trigger: () => toggleClose(item), label: 'Close', hidden: item.status === "CLOSE" },
            { type: 'button', trigger: () => toggleStart(item), label: 'Undo', hidden: undoable(item, cache) }
        ]
    }

    const items = (item, cache) => {
        return [
            { value: generateZeros(item.id, 5) },
            { value: moment(item.begshift).format("MM-DD-YYYY HH:mm:ss") },
            { value: item.status },
            { value: <DataOperation actions={actions(item, cache)} /> }
        ]
    }

    useEffect(() => {
        if (show) refetch()
    }, [show])

    useEffect(() => {
        if (data?.result?.length) {
            let tempdata = sorted ? sortBy(data?.result, sorted) : data?.result
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    ondoubleclick: () => rowSelect(item),
                    items: items(item, cache)
                }
            }))
        }
        else setrecords([])
    }, [data, sorted, cache])

    const overrideToggle = () => {
        if (!showDelete) toggle()
    }

    const cancelTransfer = () => {
        setfortransfer()
        setCurrentRecord()
        setcurrtransfer()
    }

    return (
        <AppModal show={show} setshow={overrideToggle} title="Cashier Schedule Logs">
            <div className="w-[750px] h-[75vh] flex flex-col py-3 font-bold">
                <div className="font-normal bg-gradient-to-l from-primary-300 to-primary-400 flex justify-between items-center rounded-md text-sm">
                    {
                        fortransfer?.length > 0 ? (
                            <>
                                <span className="mx-2 my-1">{fortransfer.length} items for transfer.</span>
                                <XMarkIcon className="w-5 h-5 mr-2 cursor-pointer text-red-500" onClick={() => cancelTransfer()} />
                            </>
                        ) : null
                    }
                </div>
                <DataRecords
                    columns={columns}
                    records={records}
                    page={startpage}
                    setPage={setstartpage}
                    itemsperpage={itemsperpage}
                    setsorted={setsorted}
                />
                <NotificationDelete
                    name={`#${generateZeros(currentRecord?.id, 5)}`}
                    show={showDelete}
                    setshow={setShowDelete}
                    handleDelete={handleDelete}
                    refetch={refetch}
                />
            </div>
        </AppModal>
    )
}

export default CasheringSchedule