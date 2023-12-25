import React from 'react'
import { BiError } from 'react-icons/bi'

const AppErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="w-full h-full flex items-center justify-center py-5">
            <div className="flex flex-col gap-[10px] w-[500px] bg-gray-300 p-5 rounded-[10px]">
                <p className="font-bold flex items-center gap-[10px]"><BiError className="text-[20px] text-[#ff0000]" /> Something went wrong:</p>
                <span className="mr-5 text-[12px]">
                    {error?.name ? <span>{error?.name}: <br /></span> : ""}
                    {error?.message}
                </span>
                <button className="mt-[20px] bg-gray-400 rounded-[5px] w-fit py-2 px-4 text-[13px]" onClick={resetErrorBoundary}>Try again</button>
            </div>
        </div>
    )
}

export default AppErrorFallback