import moment from "moment"
import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from "react-query"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import { processForm } from "../../../utilities/functions/query.functions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { createInventoryPrice, updateInventory } from "../inventory/inventory.services"

const CasheringQuantity = ({ show, toggle, item, setitem, cart, setcart, vat, transno }) => {
    const { handleNotification } = useNotificationContext()
    const queryClient = useQueryClient()
    const inputRef = useRef()
    const [quantity, setquantity] = useState("")
    const [current, setcurrent] = useState("")
    const [price, setprice] = useState("")
    const { mutate } = processForm(undefined, 'Inventory-Prices', () => { }, createInventoryPrice)

    const onFocus = (e) => {
        e.target.select()
    }

    const onKeyDown = (e) => {
        if (show) {
            if (e.key === 'Enter') {
                addToCart()
            }
        }
    }

    const addToCart = () => {
        // if (current !== currencyFormat.format(price)) {
        //     handleNotification({
        //         type: 'error',
        //         message: "You have an invalid applied price. Make sure that the current price is equivalent to the applied price when submitting."
        //     })
        //     return
        // }
        if (!quantity) {
            handleNotification({
                type: 'error',
                message: "Quantity input is required."
            })
            return
        }
        if (quantity) {
            let tax = (item.vatable === "Y" ? vat : 0)
            let existing = cart?.filter((i => i.item === item.id))
            let totalqty = existing?.reduce((prev, curr) => prev + Number(curr?.input?.qty), 0) + Number(quantity)
            if (Number(item.stocks) < totalqty) {
                handleNotification({
                    type: 'error',
                    message: `${item.name} ${item.details} ${item.unit} has insufficient stocks.`,
                })
                return
            }
            let unit = price - (price * tax)
            const purchase = {
                code: transno?.code,
                conv: item.conv,
                acquisition: item.acquisition,
                position: moment(new Date()).format("YYYY-MM-DD-HH-mm-ss"),
                name: item.name,
                details: item.details,
                unit: item.unit,
                category: item.category,
                time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                item: item.id,
                product: item.product,
                purchase: quantity,
                dispense: quantity,
                price: price,
                total: quantity * price,
                vat: quantity * (price * tax),
                less: 0,
                net: quantity * price,
                discount: 0,
                taxrated: tax,
                toreturn: 0,
                returned: 0,
                input: {
                    product: `${item.name} ${item.details} ${item.unit}`,
                    qty: quantity,
                    unit: unit,
                    vat: quantity * (price * tax),
                    price: quantity * price,
                    net: quantity * price
                }
            }
            setitem(purchase)
            setcart(prev => [...prev, purchase])
            inputRef.current.blur()
            toggle()
        }
    }

    const updatePrice = async (reference) => {
        let param = {
            inventory: {
                price: price,
                id: reference.id
            },
            price: {
                item: reference.id,
                product: reference.product,
                conv: reference.acquisition === "CONVERSION" ? reference.conv : 0,
                stocks: reference.stocks,
                oldprice: item.price,
                newprice: price,
                acquisition: reference.acquisition,
            }
        }
        let res = await updateInventory(param.inventory)
        if (res.success) {
            queryClient.invalidateQueries(`inventory-index`)
            mutate(param.price)
            setcurrent(currencyFormat.format(price))
        }
    }

    const onChange = (e) => {
        const { value } = e.target
        setquantity(value)
    }

    const onPriceChange = (e) => {
        const { value } = e.target
        setprice(value)
    }

    useEffect(() => {
        if (show) {
            inputRef.current.focus()
            setquantity("")
            setcurrent(currencyFormat.format(item.price))
            setprice(item.price)
            return
        }
        inputRef.current.blur()
    }, [show])

    return (
        <AppModal show={show} setshow={toggle} title="Enter Quantity">
            <div className="w-[400px] flex flex-col py-3 gap-[20px] no-select">
                <label htmlFor="">Current Price:</label>
                <input
                    type="text"
                    value={current}
                    tabIndex={-1}
                    readOnly
                    className="w-full" />
                <label htmlFor="">Applied Price:</label>
                <div className="flex gap-2 w-full">
                    <input
                        type="number"
                        value={price}
                        onChange={onPriceChange}
                        className="w-full" />
                    {/* <button type="button" className="w-14 h-12 flex items-center justify-center border border-blue-600 bg-blue-500 hover:bg-blue-400" onClick={() => updatePrice(item)}>
                        <PencilSquareIcon className="w-6 h-6 m-auto text-white" />
                    </button> */}
                </div>
                <label htmlFor="">Quantity:</label>
                <input
                    ref={inputRef}
                    type="number"
                    value={quantity}
                    onFocus={onFocus}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder="Quantity"
                    className="w-full" />
                <button type="button" className="py-3 bg-blue-500 border border-blue-600 text-white hover:bg-blue-400" onClick={() => addToCart()}>
                    Add to cart
                </button>
            </div>
        </AppModal>
    )
}

export default CasheringQuantity