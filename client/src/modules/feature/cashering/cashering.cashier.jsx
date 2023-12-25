import moment from "moment"
import React, { useEffect, useState } from 'react'
import { sqlTimestamp } from "../../../utilities/functions/datetime.functions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { createCollection, createRemittance, createShift, updateShift } from "./cashering.service"

const CasheringCashier = ({ show, toggle, user, shift, setshift, setstartcash, drawercash, setdrawercash, shiftno, setshiftno }) => {
    const [duration, setduration] = useState()
    const [cash, setcash] = useState("")
    const [remittance, setremittance] = useState("")
    const [totalbills, settotalbills] = useState(0)
    const [totalvalue, settotalvalue] = useState(0)
    const [rcd, setrcd] = useState({
        php1k: "",
        php5h: "",
        php2h: "",
        php1h: "",
        php50: "",
        php20: "",
        php10: "",
        php5p: "",
        php1p: "",
        php0c: ""
    })

    const onChange = (e) => {
        const { value } = e.target
        setcash(value)
    }

    const onRemittanceChange = (e) => {
        const { value } = e.target
        setremittance(value)
    }

    const onRcdChange = (e) => {
        const { name, value } = e.target
        setrcd(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        settotalbills(Number(rcd.php1k) + Number(rcd.php5h) + Number(rcd.php2h) + Number(rcd.php1h) + Number(rcd.php50) + Number(rcd.php20) + Number(rcd.php10) + Number(rcd.php5p) + Number(rcd.php1p) + Number(rcd.php0c))
        settotalvalue(Number(rcd.php1k * 1000) + Number(rcd.php5h * 500) + Number(rcd.php2h * 200) + Number(rcd.php1h * 100) + Number(rcd.php50 * 50) + Number(rcd.php20 * 20) + Number(rcd.php10 * 10) + Number(rcd.php5p * 5) + Number(rcd.php1p * 1) + Number(rcd.php0c))
    }, [rcd])

    const timeDurationInHours = (beg, end) => {
        var diff = (end - beg) / 1000
        diff /= (60 * 60)
        return Math.abs(Math.round(diff))
    }

    const onSubmitShift = async (e) => {
        e.preventDefault()
        let currentTime = new Date()
        if (shift === "CLOSE") {
            let param = {
                account: user.id,
                begcash: cash,
                begshift: sqlTimestamp(currentTime)
            }
            let res = await createShift(param)
            let sched = res?.result?.insertId
            if (res.success) {
                setshift("START")
                setstartcash(cash)
                setdrawercash(cash)
                setshiftno(sched)
                localStorage.setItem("shift", JSON.stringify({
                    shift: sched,
                    status: "START",
                    begcash: cash,
                    begshift: currentTime
                }))
                toggle()
            }
            return
        }
        if (shift === "START") {
            let param = {
                shift: {
                    account: user.id,
                    endshift: moment(currentTime).format("YYYY-MM-DD HH:mm:ss"),
                    endcash: cash,
                    status: "CLOSE",
                    totalhrs: duration,
                    id: shiftno
                },
                remit: {
                    account: user.id,
                    shift: shiftno,
                    amount: remittance,
                },
                collect: {
                    account: user.id,
                    shift: shiftno,
                    bills: totalbills,
                    php_2k: rcd.php_2k,
                    php_1k: rcd.php_1k,
                    php_5h: rcd.php_5h,
                    php_2h: rcd.php_2h,
                    php_1h: rcd.php_1h,
                    php_50: rcd.php_50,
                    php_20: rcd.php_20,
                    php_10: rcd.php_10,
                    php_5p: rcd.php_5p,
                    php_1p: rcd.php_1p,
                    php_0c: rcd.php_0c,
                    total: totalvalue,
                }
            }
            let resShift = await updateShift(param.shift)
            let resRemit = await createRemittance(param.remit)
            let resCollect = await createCollection()
            if (resShift.success && resRemit.success && resCollect.success) {
                setshift("CLOSE")
                setstartcash("0.00")
                setdrawercash("0.00")
                setshiftno()
                localStorage.removeItem("shift")
                toggle()
            }
            return
        }
    }

    useEffect(() => {
        if (show) {
            setcash("")
            if (shift === "START") {
                setcash(drawercash)
                let beg = new Date(JSON.parse(localStorage.getItem("shift"))?.begshift).getTime()
                let end = (new Date()).getTime()
                setduration(`${timeDurationInHours(beg, end)}`)
            }
        }
    }, [show])


    return (
        <AppModal show={show} setshow={toggle} title="Cashier Shift">
            <form onSubmit={onSubmitShift} className="w-[600px] flex flex-col py-3 gap-[20px] no-select">
                <div className="flex gap-[20px]">
                    <div className="flex flex-col gap-[5px] text-sm w-full">
                        <label htmlFor="amount">{shift === "START" ? "Ending" : "Starting"} Cash:</label>
                        <input
                            type="number"
                            name="amount"
                            className={`w-full`}
                            placeholder="Amount"
                            value={cash}
                            onChange={onChange}
                            readOnly={shift === "START"}
                            required
                        />
                    </div>
                    {
                        (shift === "START") ? (
                            <div className="flex flex-col gap-[5px] text-sm w-full">
                                <label htmlFor="amount">Shift Total Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    className={`w-full`}
                                    value={`${duration} hr/s`}
                                    readOnly={true}
                                />
                            </div>
                        ) : null
                    }
                </div>
                {
                    (shift === "START") ? (
                        <>
                            <div className="flex flex-col gap-[5px] text-sm w-full">
                                <label htmlFor="remittance">Total Remittance:</label>
                                <input
                                    type="number"
                                    name="remittance"
                                    className={`w-full`}
                                    placeholder="Remittance Amount"
                                    value={remittance}
                                    onChange={onRemittanceChange}
                                    required={shift === "START"}
                                />
                            </div>
                            <div className="flex gap-[20px]">
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php1k">1000 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php1k"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php1k}
                                        onChange={onRcdChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="No. of Peso Bills">500 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php5h"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php5h}
                                        onChange={onRcdChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php2h">200 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php2h"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php2h}
                                        onChange={onRcdChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-[20px]">
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php1h">100 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php1h"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php1h}
                                        onChange={onRcdChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php50">50 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php50"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php50}
                                        onChange={onRcdChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php20">20 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php20"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php20}
                                        onChange={onRcdChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-[20px]">
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php10">10 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php10"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php10}
                                        onChange={onRcdChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php5p">5 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php5p"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php5p}
                                        onChange={onRcdChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php1p">1 Denomination:</label>
                                    <input
                                        type="number"
                                        name="php1p"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php1p}
                                        onChange={onRcdChange}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-[20px]">
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="php0c">Centavo:</label>
                                    <input
                                        type="number"
                                        name="php0c"
                                        className={`w-full`}
                                        placeholder="No. of Peso Bills"
                                        value={rcd.php0c}
                                        onChange={onRcdChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="totalbills">Total No. of Denomination:</label>
                                    <input
                                        type="number"
                                        name="totalbills"
                                        className={`w-full`}
                                        value={totalbills}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="flex flex-col gap-[5px] text-sm w-full">
                                    <label htmlFor="totalvalue">Total No. of Denomination:</label>
                                    <input
                                        type="number"
                                        name="totalvalue"
                                        className={`w-full`}
                                        value={totalvalue}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null
                }
                <div className="flex justify-center w-full mt-5">
                    <button type="submit" className="button-link">
                        {shift === "START" ? "End" : "Begin"} Shift
                    </button>
                </div>
            </form>
        </AppModal>
    )
}

export default CasheringCashier