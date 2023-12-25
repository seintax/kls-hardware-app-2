import {
    CalculatorIcon,
    ClipboardDocumentCheckIcon,
    HomeIcon,
    NewspaperIcon,
    PresentationChartLineIcon,
    ShoppingCartIcon,
    UsersIcon
} from "@heroicons/react/24/outline"
import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import AppBreadcrumbs from "../../../utilities/interface/application/aesthetics/app.breadcrumb"
import AppSidebar from "../../../utilities/interface/application/navigation/app.sidebar"
import { fetchShiftByStart } from "../cashering/cashering.service"

export const userNavigation = [
    { name: "My Profile", href: "/profile" },
    // { name: "Settings", href: "/config" },
    { name: "Activity", href: "/activity" },
    { name: "Sign out", href: "/" },
]

const menulist = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
    // { name: "Suppliers", href: "/suppliers", icon: UserGroupIcon, current: false },
    {
        name: "Stocks",
        icon: ShoppingCartIcon,
        cascade: false,
        children: [
            { name: "Masterlist", href: "/masterlist" },
            { name: "Inventory", href: "/inventory" },
            { name: "Deliveries", href: "/delivery" },
            { name: "Stock Transfer", href: "/transfer" },
        ]
    },
    { name: "Cashering", href: "/cashering", icon: CalculatorIcon, current: false },
    {
        name: "Transactions",
        icon: ClipboardDocumentCheckIcon,
        cascade: false,
        children: [
            { name: "Credits", href: "/credits" },
            { name: "Returns", href: "/returns" },
            { name: "Cheque Monitor", href: "/monitor" },
        ]
    },
    {
        name: "Libraries",
        icon: NewspaperIcon,
        cascade: false,
        children: [
            { name: "Suppliers", href: "/suppliers" },
            { name: "Customers", href: "/customer" },
            { name: "Categories", href: "/category" },
            { name: "Discounts", href: "/discount" },
            { name: "Measurements", href: "/measurement" },
        ]
    },
    { name: "Reports", href: "/reports", icon: PresentationChartLineIcon, current: false },
    { name: "Accounts", href: "/users", icon: UsersIcon, current: false },
]

const DashboardIndex = () => {
    // const user = JSON.parse(localStorage.getItem("cred"))
    const { handleNotification } = useNotificationContext()
    const { trail, user, setuser } = useClientContext()

    useEffect(() => {
        const cred = JSON.parse(localStorage.getItem("cred"))
        if (cred) {
            setuser(cred)
            const instantiateUser = async () => {
                if (cred?.id) {
                    let res = await fetchShiftByStart(cred.id, sqlDate())
                    if (!res.success) {
                        handleNotification({
                            type: 'error',
                            message: "An error occured during retrieval for shift schedule."
                        })
                        return
                    }
                    if (res?.result?.id) {
                        localStorage.setItem("shift", JSON.stringify({
                            shift: res?.result?.id,
                            status: res?.result?.status,
                            begcash: res?.result?.begcash,
                            begshift: res?.result?.begshift
                        }))
                    }
                    else localStorage.removeItem("shift")
                }
                else {
                    handleNotification({
                        type: 'error',
                        message: "Invalid user data."
                    })
                    localStorage.removeItem("shift")
                }
            }

            instantiateUser()
        }
    }, [])

    return (
        <div className="flex h-screen flex-col">
            <AppSidebar menulist={menulist} />
            <main className="flex flex-col md:pl-64 w-full flex-grow overflow-hidden">
                <AppBreadcrumbs pages={trail} />
                <div className="p-2 flex flex-col flex-grow overflow-auto relative">
                    <Outlet />
                </div>
            </main>
            {/* <NotificationContainer /> */}
        </div>
    )
}

export default DashboardIndex