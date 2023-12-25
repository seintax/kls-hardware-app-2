import React, { useEffect } from 'react'
import { Link, useLocation } from "react-router-dom"
import { useClientContext } from "../../context/client.context"
import DataError from "./data.error"
import DataLoading from "./data.loading"
import DataNoRecord from "./data.norecord"

const DataIndex = ({ name, data, isLoading, isError, inputLink, setter, manage, children }) => {
    const location = useLocation()
    const { handleTrail } = useClientContext()

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    const toggleAdd = () => {
        if (setter) {
            setter()
            manage(true)
        }
    }

    if (!manage && (!data?.result || data?.result?.length == 0 || !isLoading)) {
        return (
            <DataNoRecord
                title="No records"
                description={`Get started by creating a new ${name}`}
                button={{ name: `Add ${name}`, link: inputLink, trigger: () => toggleAdd() }}
            />
        )
    }

    return (
        <div className='flex flex-col py-6 px-4 sm:px-6 lg:px-8 h-full'>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto no-select">
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">{name.toUpperCase()}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all entries registered in the system.
                    </p>
                </div>
                {
                    manage && (
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Link onClick={() => toggleAdd()} className="button-link">
                                Add {name}
                            </Link>
                        </div>
                    )
                }
            </div>
            {children}
            {(isLoading && (<DataLoading loading={isLoading} />))}
            {(isError && (<DataError />))}
        </div>
    )
}

export default DataIndex