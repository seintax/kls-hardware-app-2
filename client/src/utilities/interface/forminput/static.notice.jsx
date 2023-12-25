import React from 'react'

const StaticNotice = ({ name, errors }) => {
    return (
        (errors) ? (
            errors?.[name] && (
                <p className="mt-2 text-sm text-red-600">
                    {errors?.[name]?.message}
                </p>
            )
        ) : null
    )
}

export default StaticNotice