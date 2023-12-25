import React from 'react'
import AppModal from "../../../utilities/interface/application/modalities/app.modal"

const ViewerToolFixer = ({ show, setshow, tooldata }) => {

    return (
        <AppModal show={show} setshow={setshow} title="Fixer Tool">
            <div className="w-[750px] min-h-[100px] flex flex-col pb-4 font-bold items-center justify-start text-md">
                {tooldata}
            </div>
        </AppModal>
    )
}

export default ViewerToolFixer