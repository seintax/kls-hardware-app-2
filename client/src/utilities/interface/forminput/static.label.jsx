import React from 'react'

const StaticLabel = ({ name, label, optional }) => {
    return (
        <div className="flex justify-between">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            {optional && <span className="text-sm text-gray-500">Optional</span>}
        </div>
    )
}

export default StaticLabel