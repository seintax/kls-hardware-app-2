import React, { useEffect, useState } from 'react'
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { updateTransaction } from "../cashering/cashering.service"

const ViewerToolApply = ({ id, show, setshow, summarydata, refetcher }) => {
    const [values, setvalues] = useState({
        vat: "",
        total: "",
        less: "",
        net: "",
        returned: ""
    })

    useEffect(() => {
        if (show) setvalues(summarydata)
    }, [show])


    const onChange = (e) => {
        const { name, value } = e.target
        setvalues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onApplySummary = () => {
        setvalues(summarydata)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (window.confirm(`Are you sure you want to apply this values to the current transaction details?`)) {
            let data = {
                ...values,
                id: id
            }
            let res = await updateTransaction(data)
            if (res.success) {
                refetcher()
                setshow(false)
            }
        }
    }

    return (
        <AppModal show={show} setshow={setshow} title="Fixer Tool">
            <form onSubmit={onSubmit} className="w-[750px] min-h-[100px] flex flex-col pb-4 font-bold items-center justify-start text-md gap-3">
                <div className="flex gap-3 text-xs font-normal relative items-center w-full">
                    <label htmlFor="vat" className="uppercase absolute bg-gray-300 ml-2 px-2 py-0.5 rounded-md">vat</label>
                    <input
                        id="vat"
                        name="vat"
                        type="number"
                        min="0.00"
                        step="0.001"
                        onChange={onChange}
                        value={values.vat}
                        className="w-full text-xs pl-16"
                        autoComplete="off"
                    />

                </div>
                <div className="flex gap-3 text-xs font-normal relative items-center w-full">
                    <label htmlFor="total" className="uppercase absolute bg-gray-300 ml-2 px-2 py-0.5 rounded-md">tot</label>
                    <input
                        id="total"
                        name="total"
                        type="number"
                        min="0.00"
                        step="0.001"
                        onChange={onChange}
                        value={values.total}
                        className="w-full text-xs pl-16"
                        autoComplete="off"
                    />

                </div>
                <div className="flex gap-3 text-xs font-normal relative items-center w-full">
                    <label htmlFor="less" className="uppercase absolute bg-gray-300 ml-2 px-2 py-0.5 rounded-md">les</label>
                    <input
                        id="less"
                        name="less"
                        type="number"
                        min="0.00"
                        step="0.001"
                        onChange={onChange}
                        value={values.less}
                        className="w-full text-xs pl-16"
                        autoComplete="off"
                    />

                </div>
                <div className="flex gap-3 text-xs font-normal relative items-center w-full">
                    <label htmlFor="net" className="uppercase absolute bg-gray-300 ml-2 px-2 py-0.5 rounded-md">net</label>
                    <input
                        id="net"
                        name="net"
                        type="number"
                        min="0.00"
                        step="0.001"
                        onChange={onChange}
                        value={values.net}
                        className="w-full text-xs pl-16"
                        autoComplete="off"
                    />

                </div>
                <div className="flex gap-3 text-xs font-normal relative items-center w-full">
                    <label htmlFor="returned" className="uppercase absolute bg-gray-300 ml-2 px-2 py-0.5 rounded-md">ret</label>
                    <input
                        id="returned"
                        name="returned"
                        type="number"
                        min="0.00"
                        step="0.001"
                        onChange={onChange}
                        value={values.returned}
                        className="w-full text-xs pl-16"
                        autoComplete="off"
                    />

                </div>
                <div className="w-full flex justify-between">
                    <button type="button" className="button-red flex-none" onClick={() => onApplySummary()}>Apply Summary Values</button>
                    <div className="flex gap-3">
                        <button type="button" className="button-red flex-none" onClick={() => setshow(false)}>Cancel</button>
                        <button type="submit" className="button-blue flex-none">Apply</button>
                    </div>
                </div>
            </form>
        </AppModal>
    )
}

export default ViewerToolApply