import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQueryClient } from "react-query"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { updatePayment } from "../cashering/cashering.service"

const MonitorRecords = ({ setter, manage, refetch, data, setprintable }) => {
    const { handleNotification } = useNotificationContext()
    const queryClient = useQueryClient()
    const [records, setrecords] = useState()
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Transaction', stack: false, sort: 'code' },
            { name: 'Cheque No.', stack: true, sort: 'refcode', size: 200 },
            { name: 'Cheque Date', stack: true, sort: 'refdate', size: 200 },
            { name: 'Amount', stack: true, sort: 'amount', size: 120 },
            { name: 'Type', stack: true, sort: 'type', size: 120 },
            { name: 'Expiration', stack: true, size: 150 },
            { name: 'Status', stack: true, sort: 'refstat', size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 200 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const toggleClaim = async (item) => {
        if (window.confirm("Do you wish to set this cheque's status as claimed?")) {
            let param = {
                refstat: "CLAIMED",
                id: item.id
            }
            let res = await updatePayment(param)
            if (res.success) {
                queryClient.invalidateQueries("monitor-index")
                handleNotification({
                    type: 'success',
                    message: `Cheque No. ${item.refcode} has been set to claimed status.`,
                })
            }
        }
    }

    const toggleConvert = async (item) => {
        if (window.confirm("Do you wish to convert this as cash?")) {
            let param = {
                method: "CASH",
                refcode: "NA",
                refdate: null,
                refstat: "NOT APPLICABLE",
                id: item.id
            }
            let res = await updatePayment(param)
            if (res.success) {
                queryClient.invalidateQueries("monitor-index")
                handleNotification({
                    type: 'success',
                    message: `Cheque No. ${item.refcode} mode of payment has been modified to CASH and removed from the list.`,
                })
            }
        }
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleConvert(item), label: 'Convert as Cash', hidden: item.method === "CASH" || item.refstat === "CLAIMED" },
            { type: 'button', trigger: () => toggleClaim(item), label: 'Claim', hidden: item.refstat === "CLAIMED" },
        ]
    }

    const timeDurationInDays = (beg, end) => {
        var diff = (end - beg) / 1000
        diff /= (60 * 60) * 24
        return Math.round(diff)
    }

    const items = (item) => {
        let beg = (new Date()).getTime()
        let end = new Date(item.refdate).getTime()
        return [
            { value: item.code },
            { value: item.refcode },
            { value: moment(item.refdate).format("MM-DD-YYYY") },
            { value: currencyFormat.format(item.amount) },
            { value: item.type },
            { value: `${timeDurationInDays(beg, end)} Day/s` },
            { value: item.refstat },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    const print = (item) => {
        let beg = (new Date()).getTime()
        let end = new Date(item.refdate).getTime()
        return [
            { value: item.code },
            { value: item.refcode },
            { value: moment(item.refdate).format("MM-DD-YYYY") },
            { value: currencyFormat.format(item.amount) },
            { value: item.type },
            { value: `${timeDurationInDays(beg, end)} Day/s` },
            { value: item.refstat },
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
            setprintable(tempdata?.map((item, i) => {
                return {
                    key: item?.id,
                    ondoubleclick: () => rowSelect(item),
                    items: print(item)
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
export default MonitorRecords