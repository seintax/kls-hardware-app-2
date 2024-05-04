import { ArchiveBoxArrowDownIcon, ExclamationTriangleIcon, PrinterIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React from 'react'
import { useQueryClient } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { balanceInventory } from "./inventory.services"

const InventoryNavigate = ({ label, name, search, setSearch, printable, showErrors, setShowErrors }) => {
    const { handleNotification } = useNotificationContext()
    const { user, setloading } = useClientContext()
    const location = useLocation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const balanceAlgorithm = async () => {
        if (window.confirm("Do you wish to run an overall balancing algorithm for the inventory transactions?")) {
            if (window.confirm("This is a heavy protocol. Are you sure you want to proceed?")) {
                if (window.confirm("Changes done by this action will be irreversable. Do you wish to continue?")) {
                    if (user.id === 1) {
                        setloading(true)
                        let res = await balanceInventory()
                        if (res.success) queryClient.invalidateQueries(`${name.toLowerCase()}-index`)
                        setloading(false)
                        return
                    }
                    handleNotification({
                        type: 'error',
                        message: "You are not authorized to perform this protocol."
                    })
                }
            }
        }
    }

    const goTo = (url) => {
        if (location.pathname === `/${url}`) return
        navigate(`/${url}`)
    }

    const toggleAll = () => {
        if (search.all[name.toLowerCase()] === "Y") {
            setSearch(prev => ({
                ...prev,
                all: {
                    ...prev.all,
                    [name.toLowerCase()]: "N"
                }
            }))
            queryClient.invalidateQueries(`${name.toLowerCase()}-index`)
            return
        }
        setSearch(prev => ({
            ...prev,
            all: {
                ...prev.all,
                [name.toLowerCase()]: "Y"
            }
        }))
        queryClient.invalidateQueries(`${name.toLowerCase()}-index`)
    }

    const printData = async () => {
        let asOf = new Date()
        localStorage.setItem("inventory", JSON.stringify({
            title: location?.pathname === "/inventory/conversion" ? "INVENTORY CONVERSION REPORT" : "INVENTORY REPORT",
            subtext: `as of ${moment(asOf).format("MM-DD-YYYY hh:mm:ss A")}`,
            data: printable
        }))
        window.open(`/#/print/inventory/${moment(asOf).format("MMDDYYYYHHmmss")}`, '_blank')
    }

    const withError = () => {
        setShowErrors(prev => !prev)
    }

    return (
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto no-select">
                <h1 className="text-2xl font-semibold text-gray-900 capitalize">{label?.toUpperCase()}</h1>
                <p className="mt-2 text-sm text-gray-700">
                    A list of all entries registered in the system.
                </p>
            </div>
            <div className="flex gap-[10px] text-sm pl-5 h-full items-end font-bold">
                <button className="button-link" onClick={() => printData()}>
                    <PrinterIcon className="w-5 h-5 text-white" />
                </button>
                <div className={`border border-1 border-[#b317a3] px-3 rounded-lg font-normal text-sm no-select py-2 ${location?.pathname === "/inventory" ? "text-[#810c76] bg-gradient-to-r from-[#f7f7fa] to-[#f59df8]" : "cursor-pointer text-[#b317a3] border-[#b317a3]"}`} onClick={() => goTo("inventory")}>
                    Procurement
                </div>
                <div className={`border border-1 border-[#b317a3] px-3 rounded-lg font-normal text-sm no-select py-2 ${location?.pathname === "/inventory/conversion" ? "text-[#810c76] bg-gradient-to-r from-[#f7f7fa] to-[#f59df8]" : "cursor-pointer text-[#b317a3] border-[#b317a3]"}`} onClick={() => goTo("inventory/conversion")}>
                    Conversion
                </div>
                <button className={`border border-1 border-[#b317a3] px-3 py-2 rounded-lg font-normal ${showErrors ? "text-[#b317a3] line-through" : "bg-gradient-to-r from-[#1b0372] to-[#700474] text-white"} text-sm no-select py-1`} onClick={() => withError()}>
                    <ExclamationTriangleIcon className="w-5 h-5" />
                </button>
                {/* <button className="button-link" onClick={() => withError()}>
                    <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                </button> */}
                <button className={`flex items-center gap-3 border border-1 border-[#b317a3] px-3 py-2 rounded-lg font-normal ${search?.all && search?.all[name.toLowerCase()] === "Y" ? "text-[#b317a3] line-through" : "bg-gradient-to-r from-[#1b0372] to-[#700474] text-white"} text-sm no-select py-1`} onClick={() => toggleAll()}>
                    {/* {search?.all[name.toLowerCase()] === "Y" ? `All ${name}` : "With Stocks Only"} */}
                    <ArchiveBoxArrowDownIcon className="w-5 h-5" /> With Stocks Only
                </button>
                {
                    user?.id === 1 ? (
                        <button className="border border-1 border-primary-700 px-3 rounded-lg font-normal text-sm no-select py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white hover:from-primary-500 hover:to-primary-700" onClick={() => balanceAlgorithm()}>
                            Balance Inventory
                        </button>
                    ) : null
                }
            </div>
        </div>
    )
}

export default InventoryNavigate