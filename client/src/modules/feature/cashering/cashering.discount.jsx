import React, { useEffect, useState } from 'react'
import AppModal from "../../../utilities/interface/application/modalities/app.modal"

const CasheringDiscount = ({ show, toggle, net, recalibrate, setreceipt, transno }) => {
    const [pwd, setpwd] = useState(false)
    const [senior, setsenior] = useState(false)
    const [custom, setcustom] = useState(false)
    const [amount, setamount] = useState("")
    const [discount, setdiscount] = useState(0)

    const onCheckChanged = (e) => {
        const { name } = e.target
        if (name === "pwd") setpwd(!pwd)
        if (name === "senior") setsenior(!senior)
        if (name === "custom") {
            setcustom(!custom)
            if (custom)
                setamount("")
        }
    }

    useEffect(() => {
        let discount = 0
        if (pwd) discount = discount + 0.2
        if (senior) discount = discount + 0.2
        if (custom) discount = discount + ((Number(amount) / net))
        setdiscount(Number((discount * 100).toFixed(2)))
    }, [pwd, senior, custom, amount, net])

    useEffect(() => {
        if (show) {
            setpwd(false)
            setsenior(false)
            setcustom(false)
            setamount("")
            setdiscount(0)
        }
    }, [transno?.code])

    const onAmountChange = (e) => {
        const { value } = e.target
        setamount(value)
    }

    const applyDiscount = () => {
        let applieddiscount = discount.toFixed(2)
        let discountedcarts = recalibrate(applieddiscount)
        setreceipt(prev => ({
            ...prev,
            applieddiscount,
            discountedcarts
        }))
        toggle()
    }

    return (
        <AppModal show={show} setshow={toggle} title="Quantity">
            <div className="w-[400px] flex flex-col py-3 gap-[20px] no-select">
                <div className="flex items-center gap-[20px]">
                    <input
                        type="checkbox"
                        id="pwd"
                        name="pwd"
                        checked={pwd}
                        onChange={onCheckChanged}
                    />
                    <label htmlFor="pwd" className="cursor-pointer">
                        Person with Disability (20%)
                    </label>
                </div>
                <div className="flex items-center gap-[20px]">
                    <input
                        type="checkbox"
                        id="senior"
                        name="senior"
                        checked={senior}
                        onChange={onCheckChanged}
                    />
                    <label htmlFor="senior" className="cursor-pointer">
                        Senior Citizen Discount (20%)
                    </label>
                </div>
                <div className="flex items-center gap-[20px]">
                    <input
                        type="checkbox"
                        id="custom"
                        name="custom"
                        checked={custom}
                        onChange={onCheckChanged}
                    />
                    <label htmlFor="custom" className="cursor-pointer">
                        Customized Discount (Amount)
                    </label>
                </div>
                <div className="flex items-center gap-[20px]">
                    <input
                        type="number"
                        className="w-full placeholder:text-gray-400 disabled:bg-gray-200 disabled:placeholder:text-gray-200"
                        placeholder="Enter amount not greater than the net amount"
                        disabled={!custom}
                        value={amount}
                        onChange={onAmountChange}
                    />
                </div>
                <div className="w-full flex justify-center mt-5">
                    Total Discount Accomulated: {discount.toFixed(2)}%
                </div>
                <div className="flex justify-center w-full mt-5">
                    <button className="button-link" onClick={() => applyDiscount()}>
                        Apply Discount
                    </button>
                </div>
            </div>
        </AppModal>
    )
}

export default CasheringDiscount