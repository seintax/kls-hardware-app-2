import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom"

const PrintBase = () => {
    useEffect(() => {
        document.title = "JBS | Report"
    }, [])


    return (
        <div className="w-screen min-h-screen bg-gradient-to-r from-[#1b0372] to-[#700474] flex items-start overflow-x-hidden">
            <Outlet />
        </div>
    )
}

export default PrintBase