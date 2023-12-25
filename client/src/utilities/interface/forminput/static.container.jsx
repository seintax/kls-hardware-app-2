import React from 'react'

const StaticContainer = ({ style, children }) => {
    return (
        <div className={`w-full ${style}`}>
            {children}
        </div>
    )
}

export default StaticContainer