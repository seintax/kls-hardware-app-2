import { ArrowLongDownIcon, ArrowLongUpIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useQuery } from "react-query"
import { Link, useLocation, useParams } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import DataError from "../../../utilities/interface/datastack/data.error"
import DataLoading from "../../../utilities/interface/datastack/data.loading"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { fetchCustomerById } from "../../library/customer/customer.services"
import CreditsRegistryUnit from "./credits.registry.unit"
import { fetchCreditsByCustomer } from "./credits.services"

const CreditsRegistry = () => {
    const { handleNotification } = useNotificationContext()
    const location = useLocation()
    const { id } = useParams()
    const { handleTrail, selected, renderSelected, search } = useClientContext()
    const { data, isLoading, isError, refetch } = useQuery('credits-item-index', () => fetchCreditsByCustomer(id, search.key))
    const [records, setrecords] = useState()
    const [information, setinformation] = useState()
    const [showCredits, setShowCredits] = useState(false)
    const [currentRecord, setCurrentRecord] = useState()
    const [currentShift, setCurrentShift] = useState(0)
    const [sorted, setsorted] = useState()
    const [key, setkey] = useState("")
    const [total, settotal] = useState(0)
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Date', stack: false, sort: 'time', size: 200 },
            { name: 'Transaction', stack: true, sort: 'code' },
            { name: 'Receipt', stack: true, sort: 'total', size: 200 },
            { name: 'Net Amount', stack: true, sort: 'total', size: 150 },
            { name: 'Partial', stack: true, sort: 'partial', size: 150 },
            { name: 'Balance', stack: true, sort: 'balance', size: 150 },
            { name: 'Waived', stack: true, sort: 'waived', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 100 },
        ]
    }

    useEffect(() => { refetch() }, [search])

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    const rowSelect = (record) => setCurrentRecord(record)

    const toggleSettle = (item) => {
        const shift = JSON.parse(localStorage.getItem("shift"))
        if (!shift?.shift) {
            handleNotification({
                type: 'error',
                message: "You are currently not in a shift.",
            })
            return
        }
        if (item.received !== item.stocks) {
            handleNotification({
                type: 'error',
                message: "Cannot edit items that has existing sales record.",
            })
            return
        }
        setCurrentShift(shift?.shift)
        setCurrentRecord(item)
        setShowCredits(true)
    }

    const toggleProduct = () => {
        setCurrentRecord()
        setShowProduct(true)
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleSettle(item), label: 'Settle' },
            // { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: moment(item.time).format("MM-DD-YYYY HH:mm:ss") },
            { value: item.code },
            { value: item.ordno },
            { value: currencyFormat.format(item.total) },
            { value: currencyFormat.format(item.partial) },
            { value: currencyFormat.format(item.balance) },
            { value: currencyFormat.format(item.waived) },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        const instantiate = async () => {
            const info = await fetchCustomerById(id)
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
            settotal(data?.result.reduce((prev, curr) => prev + amount(curr.balance), 0))
        }
        else setrecords([])
    }, [data, sorted])

    useLayoutEffect(() => {
        setkey(renderSelected("/credits", selected?.credits?.key))
    }, [])

    const balanceStatus = () => {
        let balance = amount(selected?.credits?.total || 0) - amount(total || 0)
        return balance
    }

    return (
        <div className="p-6">
            <div className="w-full flex justify-between items-center mb-[-5px]">
                <div className="flex gap-[20px] items-center">
                    <Link to="/credits" className="button-static">
                        Back to Previous List
                    </Link>
                    <span className="text-sm">
                        Customer:
                        <b className="ml-3">
                            {key}
                        </b>
                    </span>
                </div>
                <div className="text-sm flex gap-2 text-white">
                    <span className="py-0.5 px-3 rounded-md bg-blue-600">Logged: {currencyFormat.format(selected?.credits?.total || 0)}</span>
                    <span className="py-0.5 px-3 rounded-md bg-orange-600">Computed: {currencyFormat.format(total || 0)}</span>
                    {
                        (balanceStatus() !== 0) ? (
                            <span className="text-white bg-red-800 px-3 py-0.5 rounded-md flex items-center">
                                Irregular: {Math.abs(balanceStatus(data))}{balanceStatus() > 0 ?
                                    <ArrowLongUpIcon className="w-3 h-3 ml-[-2px]" /> :
                                    <ArrowLongDownIcon className="w-3 h-3 ml-[-2px]" />}
                            </span>
                        ) : (
                            <span className="text-white bg-green-600 px-3 py-0.5 rounded-md">
                                Balanced
                            </span>
                        )
                    }
                </div>
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
            <CreditsRegistryUnit id={currentRecord?.id || undefined} reference={information} show={showCredits} setshow={setShowCredits} currentShift={currentShift} />
        </div>
    )
}
export default CreditsRegistry