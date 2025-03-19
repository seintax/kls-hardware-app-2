import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from 'react'
import SpinnerIcon from "../../../assets/SpinnerIcon"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { getData } from "./database.services"

const DatabaseIndex = () => {
    const defaults = { tb: "", tag: "", max: "" }
    const [inputs, setInputs] = useState(defaults)
    const [data, setData] = useState([])
    const [deleteKey, setDeleteKey] = useState("")
    const [selectKey, setSelectKey] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { handleNotification } = useNotificationContext()

    const onChange = (e) => {
        const { name, value } = e.target
        if (name === "tb") {
            setInputs(prev => ({ ...prev, [name]: value, max: "" }))
            return
        }
        setInputs(prev => ({ ...prev, [name]: value }))
    }

    const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value)

    const onExecute = async () => {
        setData([])
        setIsLoading(true)
        await getData(inputs)
            .then(res => {
                if (res.success) {
                    const formattedData = res.result?.map(item => {
                        const keys = []
                        const values = []
                        Object.entries(item).forEach(([key, value]) => {
                            keys.push(key)
                            let _value = `'${value}'`
                            if (typeof value === 'string') _value = `'${value.replaceAll("'", "\'")}'`
                            if (isNumber(value)) _value = value
                            if (value === null) _value = "NULL"
                            values.push(_value)
                        })
                        return {
                            id: item[`${inputs.tag}_id`],
                            sql: `INSERT INTO ${inputs.tb} (${keys.join(", ")}) VALUES (${values.join(", ")});`
                        }
                    })
                    setData(formattedData)
                    setDeleteKey(`DELETE FROM ${inputs.tb} WHERE ${inputs.tag}_id > ${inputs.max}; `)
                    setIsLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                setIsLoading(false)
                handleNotification({
                    type: 'error',
                    message: JSON.stringify(err),
                })
            })
    }

    const onClear = () => {
        setData([])
    }

    const onCopy = () => {
        if (data.length === 0) return
        const text = data.map(item => item.sql).join("\n")
        navigator.clipboard.writeText(text)
            .then(() => {
                handleNotification({
                    type: 'success',
                    message: "Copied to clipboard.",
                })
            })
            .catch(err => console.error("Failed to copy:", err))
        onSaveFile()
    }

    const onCopyString = (str) => {
        if (!str) return
        navigator.clipboard.writeText(str)
            .then(() => {
                handleNotification({
                    type: 'success',
                    message: "Copied to clipboard.",
                })
            })
            .catch(err => console.error("Failed to copy:", err))
    }

    const onSaveFile = () => {
        if (data.length === 0) return
        const text = data.map(item => item.sql).join("\n")
        const sKey = `${selectKey}\n`
        const dKey = `${deleteKey}\n`
        const stringToFile = `${sKey}${dKey}${text}`
        const blob = new Blob([stringToFile], { type: "text/plain" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `backup_${inputs.tb}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    useEffect(() => {
        if (!!inputs.tb && !!inputs.tag) {
            setSelectKey(`SELECT MAX(${inputs.tag}_id) FROM ${inputs.tb};`)
        }
    }, [inputs])

    return (
        <div className="w-full h-full pb-11">
            <div className="w-full h-[calc(100%-25px)] relative">
                <div className="sticky -top-5 left-0 w-full h-[70px] bg-slate-200 flex items-center gap-5 px-5 text-sm shadow-lg border-b border-b-slate-300">
                    <div className="flex gap-4 items-center">
                        <label htmlFor="">Table:</label>
                        <input type="text" name="tb" value={inputs.tb} onChange={onChange} className="w-[220px] text-base py-1 lowercase disabled:bg-slate-200" disabled={data.length > 0 || isLoading} />
                    </div>
                    <div className="flex gap-4 items-center">
                        <label htmlFor="">Tag:</label>
                        <input type="text" name="tag" value={inputs.tag} onChange={onChange} className="w-[100px] text-base py-1 lowercase disabled:bg-slate-200" disabled={data.length > 0 || isLoading} />
                    </div>
                    <div className="flex gap-4 items-center">
                        <label htmlFor="">ID:</label>
                        <input type="number" name="max" value={inputs.max} onChange={onChange} className="w-[100px] text-base py-1 disabled:bg-slate-200" disabled={data.length > 0 || isLoading} />
                    </div>
                    <button className="bg-slate-300 px-4 py-1 border border-slate-500 hover:bg-slate-400 transition-colors ease-in delay-50" onClick={() => onExecute()}>Go</button>
                    <button className="bg-slate-300 px-4 py-1 border border-slate-500 hover:bg-slate-400 transition-colors ease-in delay-50" onClick={() => onClear()}>Clear</button>
                    <div className="flex gap-4 items-center">
                        <label htmlFor="">Count:</label>
                        <span>{data.length}</span>
                    </div>
                    <div className="flex gap-4 items-center ml-auto">
                        <label htmlFor="">Max:</label>
                        <span>{data?.at(data?.length - 1)?.id || "N/A"}</span>
                    </div>
                    <button className="bg-slate-300 px-4 py-1 border border-slate-500 hover:bg-slate-400 transition-colors ease-in delay-50" onClick={() => onCopy()}>Copy & Save</button>
                </div>
                <div className="flex flex-col gap-2 w-full h-full p-5">
                    {
                        !!inputs.tb && !!inputs.tag && (
                            <div className="flex items-center w-full break-words gap-2">
                                <span>{selectKey}</span>
                                <button className="bg-slate-300 border border-slate-500 hover:bg-slate-400 transition-colors ease-in delay-50 w-fit text-[80px]" onClick={() => onCopyString(selectKey)}>
                                    <ClipboardDocumentListIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )
                    }
                    {
                        !isLoading && data?.length > 0 && (
                            <div className="flex items-center w-full break-words gap-2">
                                <span>{deleteKey}</span>
                                <button className="bg-slate-300 border border-slate-500 hover:bg-slate-400 transition-colors ease-in delay-50 w-fit text-[80px]" onClick={() => onCopyString(deleteKey)}>
                                    <ClipboardDocumentListIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )
                    }
                    {
                        !isLoading && data?.map(item => (
                            <div key={item.id} className="w-full break-words">
                                {item.sql}
                            </div>
                        ))
                    }
                    {isLoading && (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="flex items-center justify-center bg-slate-400 shadow-lg w-fit h-fit  p-5 text-white text-lg">
                                <SpinnerIcon /> Please wait
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DatabaseIndex