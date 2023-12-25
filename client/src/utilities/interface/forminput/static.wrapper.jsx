import React from 'react'

const StaticWrapper = ({ children }) => {
    return (
        <div className="relative mt-1 rounded-md shadow-sm flex items-center gap-[5px]">
            {children}
        </div>
    )
}

export default StaticWrapper