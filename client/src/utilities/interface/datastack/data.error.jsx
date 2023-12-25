import { ShieldExclamationIcon } from "@heroicons/react/20/solid"
import React from 'react'

const DataError = () => {
    return (
        <div className="mt-5 text-center flex justify-center text-black no-select">
            <div className="bg-gray-300 px-3 py-2 rounded-[5px] flex gap-[10px] items-center text-sm">
                <ShieldExclamationIcon className="h-6 w-6 text-red-500" />
                An error has occured while requesting data.
            </div>
        </div>
    )
}

export default DataError