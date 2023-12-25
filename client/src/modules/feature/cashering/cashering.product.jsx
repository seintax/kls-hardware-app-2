import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useRef, useState } from 'react'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import { generateChar } from "../../../utilities/functions/string.functions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { fetchInventoryByAvailability } from "../inventory/inventory.services"

const CasheringProduct = ({ show, toggle, setitem, transno }) => {
    const inputRef = useRef()
    const [inventory, setinventory] = useState([])
    const [display, setdisplay] = useState([])
    const [input, setinput] = useState("")

    const selectItem = (item) => {
        setitem(item)
        toggle()
    }

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (display?.length === 1) selectItem(display[0])
        }
    }

    const onChange = (e) => {
        const { value } = e.target
        setinput(value)
    }

    const getInventory = async () => {
        let resInv = await fetchInventoryByAvailability(input)
        if (resInv?.success) {
            let inv = resInv?.result?.map(inv => {
                return {
                    acquisition: inv.acquisition,
                    category: inv.category,
                    cost: inv.cost,
                    details: inv.details,
                    drdate: inv.drdate,
                    drno: inv.drno,
                    id: inv.id,
                    isloose: inv.isloose,
                    name: inv.name,
                    price: inv.price,
                    product: inv.product,
                    receipt: inv.receipt,
                    sku: inv.sku,
                    status: inv.status,
                    stocks: inv.stocks,
                    supplier: inv.supplier,
                    unit: inv.unit,
                    vatable: inv.vatable,
                    conv: inv.conv
                }
            })
            setinventory(inv)
            setdisplay(resInv?.result)
        }
    }

    useEffect(() => {
        let disp = inventory.filter(inv => (
            inv?.name?.toLowerCase().includes(input?.toLowerCase()) ||
            inv?.details?.toLowerCase().includes(input?.toLowerCase()) ||
            inv?.sku?.toLowerCase().includes(input?.toLowerCase()) ||
            `${inv?.name?.toLowerCase()} ${inv?.details?.toLowerCase()}`.includes(input?.toLowerCase())
        ))
        setdisplay(disp)
    }, [input])


    useEffect(() => {
        inputRef.current.focus()
        setinput("")
        // if (show) {
        //     getInventory()
        // }
    }, [show])

    useEffect(() => {
        if (transno?.status === "READY") {
            getInventory()
        }
    }, [transno])


    return (
        <AppModal show={show} setshow={toggle} title="Find product in the list">
            <div className="w-[60vw] flex flex-col py-3 gap-[20px] no-select">
                <div className="flex items-center gap-[5px]">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        className="w-1/2 focus:outline-none" />
                    <MagnifyingGlassIcon className="h-6 w-6 ml-[-40px]" />
                </div>
                <div className="flex flex-col h-[400px] border border-1 border-gray-500 text-sm">
                    <div className="flex gap-[2px] bg-primary-500 text-white">
                        <div className="w-full py-2 px-3">
                            Product Name
                        </div>
                        <div className="py-2 px-3 w-[180px]">
                            Unit
                        </div>
                        <div className="py-2 px-3 w-[150px] flex justify-end mr-5">
                            Price
                        </div>
                        <div className="py-2 px-3 w-[200px] flex justify-center">
                            Stocks
                        </div>
                        <div className="py-2 px-3 w-[150px] flex justify-center">
                            Vatable
                        </div>
                        <div className="py-2 px-3 w-[180px] flex justify-center">
                            Divisible
                        </div>
                    </div>
                    <div className="w-full h-full overflow-y-scroll flex-grow">
                        {
                            display?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-[2px] hover:bg-gray-400 hover:bg-opacity-[30%]"
                                    onDoubleClick={() => selectItem(item)}
                                >
                                    <div className="w-full py-2 px-3 flex flex-col">
                                        <div>
                                            {item?.name} {item?.details}
                                        </div>
                                        <span className="text-[9px] text-gray-400">
                                            <span className={`py-0.5 mr-2 text-[9px] text-white rounded-[10px] px-1.5 ${item?.acquisition === "CONVERSION" ? "bg-red-500" : "bg-green-500"}`}>
                                                {item?.acquisition === "CONVERSION" ? "C" : "D"}
                                            </span>
                                            SKU: {item?.sku}
                                            {generateChar(item?.sku?.replaceAll("-", ""), "X", 25)}
                                        </span>
                                    </div>
                                    <div className="py-2 px-3 w-[180px] flex items-center">
                                        {item?.unit}
                                    </div>
                                    <div className="py-2 px-3 w-[150px] flex items-center justify-end mr-5">
                                        {currencyFormat.format(item?.price)}
                                    </div>
                                    <div className="py-2 px-3 w-[200px] flex items-center justify-center">
                                        {item?.stocks}
                                    </div>
                                    <div className="py-2 px-3 w-[150px] flex items-center justify-center">
                                        {item?.vatable}
                                    </div>
                                    <div className="py-2 px-3 w-[145px] flex items-center justify-center">
                                        {item?.isloose}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </AppModal>
    )
}

export default CasheringProduct