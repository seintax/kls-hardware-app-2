import React from 'react'
import InvertedLogo from "../../../../assets/Jally-white.png"
import CompanyLogo from "../../../../assets/Jally.png"

const AppLogo = ({ style = "h-16", inverted = false }) => {
    return (
        <div className="flex justify-center gap-x-3">
            <img className={style} src={inverted ? InvertedLogo : CompanyLogo} alt="Your Company" />
        </div>
    )
}

export default AppLogo