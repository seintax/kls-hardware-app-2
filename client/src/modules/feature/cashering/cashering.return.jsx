import React, { useEffect, useRef, useState } from 'react'
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"

const CasheringReturn = ({ show, toggle, item, setcart }) => {
    const { handleNotification } = useNotificationContext()
    const inputRef = useRef()
    const [qty, setqty] = useState(0)

    const onFocus = (e) => {
        e.target.select()
    }

    const onChange = (e) => {
        const { value } = e.target
        setqty(value)
    }

    useEffect(() => {
        inputRef.current.focus()
        setqty(0)
    }, [show])

    const returnItem = (e) => {
        e.preventDefault()
        if (Number(qty) > 0) {
            if (Number(qty) > Number(item.dispense)) {
                handleNotification({
                    type: 'error',
                    message: "Cannot return more than available quantity sold.",
                })
                return
            }
            setcart(prev => prev?.map(cart => {
                if (cart.position === item.position) {
                    let less = ((qty * cart?.price) * (cart?.discount / 100)) || 0
                    return {
                        ...cart,
                        dispense: Number(cart?.dispense) - (qty),
                        toreturn: qty,
                        return: {
                            qty: qty,
                            unit: cart?.unit,
                            vat: qty * (cart?.price * cart?.taxrated),
                            price: qty * cart?.price,
                            less: less || 0,
                            net: (qty * cart?.price) - less
                        }
                    }
                }
                return cart
            }))
            toggle()
        }
    }

    return (
        <AppModal show={show} setshow={toggle} title="Begin Transaction">
            <form onSubmit={returnItem} className="w-[400px] flex flex-col py-3 gap-[20px] no-select">
                <div className="w-full flex justify-start items-end mt-5">
                    <span className="text-gray-500 text-sm mr-2">
                        Product:
                    </span>
                    {item?.input?.product}
                </div>
                <div className="w-full flex justify-start items-end">
                    <span className="text-gray-500 text-sm mr-2">
                        Quantity Sold:
                    </span>
                    {item?.dispense}
                </div>
                <div className="w-full flex justify-start items-end">
                    <span className="text-gray-500 text-sm mr-2">
                        Price:
                    </span>
                    {currencyFormat.format(item?.price)}
                </div>
                <div className="w-full flex justify-start items-end">
                    <span className="text-gray-500 text-sm mr-2">
                        Discount:
                    </span>
                    {currencyFormat.format(item?.less)}
                </div>
                <div className="w-full flex justify-start items-end">
                    <span className="text-gray-500 text-sm mr-2">
                        Net:
                    </span>
                    {currencyFormat.format(item?.net)}
                </div>
                <div className="flex flex-col items-start gap-[10px]">
                    <label htmlFor="order">Quantity to Return:</label>
                    <input
                        ref={inputRef}
                        id="qty"
                        type="number"
                        className="w-full placeholder:text-gray-400 text-center"
                        placeholder="Enter quantity to return"
                        value={qty}
                        onChange={onChange}
                        onFocus={onFocus}
                    />
                </div>
                <div className="flex justify-center w-full mt-5">
                    <button className="button-link">
                        Return Item
                    </button>
                </div>
            </form>
        </AppModal>
    )
}

export default CasheringReturn