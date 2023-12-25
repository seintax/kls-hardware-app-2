import { XMarkIcon } from "@heroicons/react/24/outline"
import React, { useCallback, useEffect } from 'react'

const AppModal = ({ show, setshow, title, children, prevkeydown, full }) => {

    const keydown = useCallback(e => {
        if (prevkeydown) return
        if (show)
            if (e.key === 'Escape') setshow(false)
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => { document.removeEventListener('keydown', keydown) }
    }, [keydown])

    return (
        <div className={`${show ? "flex" : "hidden"} w-screen h-screen items-center justify-center fixed top-0 left-0 bg-black bg-opacity-[40%] overflow-y-auto z-20`}>
            <div className={`flex flex-col py-5 px-5 bg-white relative ${full ? "w-full h-full" : "min-w-[400px] h-fit"}`}>
                <div className="flex justify-between mb-3">
                    <div className="font-bold text-[15px]">{title}</div>
                    <div><XMarkIcon className="h-5 w-5 cursor-pointer" onClick={() => setshow(false)} /></div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default AppModal