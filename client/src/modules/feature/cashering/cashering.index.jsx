import moment from "moment"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import { returnConversion, returnInventory } from "../inventory/inventory.services"
import { updateRequest } from "../request/request.services"
import CasheringBegin from "./cashering.begin"
import CasheringCashier from "./cashering.cashier"
import CasheringControl from "./cashering.control"
import CasheringDiscount from "./cashering.discount"
import CasheringLogged from "./cashering.logged"
import CasheringNotice from "./cashering.notice"
import CasheringOrders from "./cashering.orders"
import CasheringPayment from "./cashering.payment"
import CasheringProduct from "./cashering.product"
import CasheringQuantity from "./cashering.quantity"
import CasheringReceipt from "./cashering.receipt"
import CasheringReimburse from "./cashering.reimburse"
import CasheringRequest from "./cashering.request"
import CasheringReturn from "./cashering.return"
import CasheringSchedule from "./cashering.schedule"
import { batchReturn, createReimbursement, createReturnRequest, fetchDispensingByTransaction, fetchRequestByProgress, fetchShiftByStart, updateDispensingByRequest, updateTransaction } from "./cashering.service"

const CasheringIndex = () => {
    const { handleNotification } = useNotificationContext()
    const parRef = useRef()
    const location = useLocation()
    const vat = 0.12
    const { handleTrail, user } = useClientContext()
    const [container, setcontainer] = useState(600)
    const [onindex, setonindex] = useState(true)

    const [showfind, setshowfind] = useState(false)
    const [showqty, setshowqty] = useState(false)
    const [showdiscount, setshowdiscount] = useState(false)
    const [showtransaction, setshowtransaction] = useState(false)
    const [showpayment, setshowpayment] = useState(false)
    const [showlogs, setshowlogs] = useState(false)
    const [showreturn, setshowreturn] = useState(false)
    const [showrequest, setshowrequest] = useState(false)
    const [showreimburse, setshowreimburse] = useState(false)
    const [showshift, setshowshift] = useState(false)
    const [showschedule, setshowschedule] = useState(false)

    const [cart, setcart] = useState([])
    const [item, setitem] = useState()

    const [shift, setshift] = useState(JSON.parse(localStorage.getItem("shift"))?.status || "CLOSE")
    const [trans, settrans] = useState("IDLE") // IDLE, READY, CANCELLED, COMPLETED
    const [startcash, setstartcash] = useState(JSON.parse(localStorage.getItem("shift"))?.begcash || 0)
    const [drawercash, setdrawercash] = useState(0)
    const [reimburse, setreimburse] = useState({ method: "", amount: "", credit: "", reference: "" })

    const [shiftno, setshiftno] = useState(JSON.parse(localStorage.getItem("shift"))?.shift || 0)
    const [transno, settransno] = useState({})
    const [transcount, settranscount] = useState(0)
    const [receipt, setreceipt] = useState({})
    const [toreturn, settoreturn] = useState()

    useEffect(() => {
        handleTrail(location?.pathname)
        let shiftdata = JSON.parse(localStorage.getItem("shift"))
        setshift(shiftdata?.status || "CLOSE")
        setshiftno(shiftdata?.shift || 0)
    }, [location])

    useLayoutEffect(() => {
        setcontainer(parRef.current.clientHeight || 600)
    }, [parRef])

    const closeFind = () => {
        setonindex(true)
        setshowfind(false)
    }

    const closeQty = () => {
        setonindex(true)
        setshowqty(false)
    }

    const closeDiscount = () => {
        setonindex(true)
        setshowdiscount(false)
    }

    const closeTransaction = () => {
        setonindex(true)
        setshowtransaction(false)
    }

    const closePayment = () => {
        setonindex(true)
        setshowpayment(false)
    }

    const closeLogs = () => {
        setonindex(true)
        setshowlogs(false)
    }

    const closeReturn = () => {
        setonindex(true)
        setshowreturn(false)
    }

    const closeRequest = () => {
        setonindex(true)
        setshowrequest(false)
    }

    const closeReimburse = () => {
        setonindex(true)
        setshowreimburse(false)
    }

    const closeShift = () => {
        setonindex(true)
        setshowshift(false)
    }

    const closeSchedule = () => {
        setonindex(true)
        setshowschedule(false)
    }

    const startShift = async () => {
        if (!user?.id) {
            handleNotification({
                type: 'error',
                message: "User information is not available. A refresh might be required."
            })
            return
        }
        if (!onindex) return
        let started = await fetchShiftByStart(user.id)
        if (started.success && !started?.result?.id) {
            setonindex(false)
            setshowshift(true)
        }
    }

    const newTransaction = async () => {
        if (!onindex) return
        if (shift === "START" && trans !== "READY") {
            setonindex(false)
            setshowtransaction(true)
        }
    }

    const downtimeInMinutes = (beg, end) => {
        var mins = ((end - beg) / 1000) / 60
        return mins
    }

    const cancelTransaction = async () => {
        if (!onindex) return
        let downtime = JSON.parse(localStorage.getItem('downtime'))
        if (downtime?.cancellation) {
            let cancellation = downtimeInMinutes(new Date(downtime?.cancellation).getTime(), (new Date()).getTime())
            if (cancellation < 1) {
                handleNotification({
                    type: 'error',
                    message: `Cancellation is still at downtime for ${(1 - cancellation).toFixed(2)}s.`,
                })
                return
            }
        }
        if (shift === "START" && trans === "READY") {
            if (window.confirm(`Do you wish to cancel transaction no. ${transno.code}}?`)) {
                let param = {
                    status: "CANCELLED",
                    ordno: `C${moment(new Date).format("YYMMDDHHmm")}`,
                    id: transno.id
                }
                let res = await updateTransaction(param)
                if (res?.success) {
                    handleNotification({
                        type: 'success',
                        message: `Transaction no. ${transno.code} has been cancelled. \nNote that cancellation has a 1 minute downtime after this action.`,
                    })
                    localStorage.setItem('downtime', JSON.stringify({
                        cancellation: new Date()
                    }))
                    settrans("CANCELLED")
                }
            }
        }
    }

    const paymentTransaction = () => {
        if (!onindex) return
        if (shift === "START" && cart?.length > 0 && trans === "READY") {
            if (receipt.applieddiscount > 0 && cart.length !== receipt.discountedcarts) {
                if (window.confirm("Discount requires calibration. Do you wish to auto-calibrate and proceed to payment?")) {
                    applyDiscount()
                    return
                }
                else return
            }
            setonindex(false)
            setshowpayment(true)
        }
    }

    const findProduct = () => {
        if (!onindex) return
        if (shift === "START" && trans === "READY") {
            setonindex(false)
            setshowfind(true)
            setitem()
        }
    }

    const transactionLogs = () => {
        if (!onindex) return
        setonindex(false)
        setshowlogs(true)
    }

    const viewRequests = () => {
        if (!onindex) return
        setonindex(false)
        setshowrequest(true)
    }

    const openSchedules = () => {
        if (!onindex) return
        setonindex(false)
        setshowschedule(true)
    }

    const applyDiscount = () => {
        if (!onindex) return
        if (shift === "START" && trans === "READY" && cart?.length > 0) {
            setonindex(false)
            setshowdiscount(true)
        }
    }

    const commitReturn = () => {
        if (!onindex) return
        if (trans === "COMPLETED" && receipt.returnstatus === "APPROVED") {
            if (window.confirm(`Do wish to commit this return with transaction no. ${transno.code}`)) {
                setonindex(false)
                setshowreimburse(true)
            }
        }
    }

    const reimbursement = async () => {
        let param = {
            transaction: {
                vat: amount(receipt.totalvat) - amount(receipt?.returnvat || 0),
                total: amount(receipt.totalprice) - amount(receipt?.returnprice || 0),
                less: amount(receipt.totaldiscount) - amount(receipt?.returndiscount || 0),
                net: amount(receipt.netamount) - amount(receipt?.returnnet || 0),
                returned: amount(transno.returned) + amount(receipt?.returnnet),
                id: transno.id
            },
            dispense: cart?.filter(f => f.toreturn > 0)
                .map(item => {
                    return {
                        dispense: amount(item.dispense) - amount(item.toreturn),
                        vat: amount(item?.input?.vat) - amount(item?.return?.vat),
                        total: amount(item.total) - amount(item?.return?.price),
                        less: amount(item.less) - amount(item?.return?.less),
                        net: amount(item.net) - amount(item?.return?.net),
                        toreturn: 0,
                        returned: amount(item.returned) + amount(item.toreturn),
                        id: item.id,
                    }
                }),
            returned: cart?.filter(f => f.toreturn > 0)
                .map(item => {
                    return {
                        code: item.code,
                        item: item.item,
                        conv: item.conv,
                        product: item.product,
                        request: receipt?.requestid,
                        qty: item.toreturn,
                        price: item.price,
                        vat: item.return.vat,
                        total: item.return.price,
                        less: item.return.less,
                        net: item.return.net,
                        discount: item.discount,
                        taxrated: item.taxrated
                    }
                }),
            request: {
                status: "COMPLETED",
                id: receipt.requestid
            },
            inventory: cart?.filter(f => f.acquisition === "PROCUREMENT" && amount(f.toreturn) > 0),
            conversion: cart?.filter(f => f.acquisition === "CONVERSION" && amount(f.toreturn) > 0),
            reimburse: {
                code: transno.code,
                request: receipt?.requestid,
                method: reimburse?.method,
                amount: amount(reimburse?.amount),
                reference: reimburse?.reference,
                account: user.id,
                shift: shiftno
            }
        }
        let resTrn = await updateTransaction(param.transaction)
        let resDis = await updateDispensingByRequest({ cart: param.dispense })
        let resRet = await batchReturn({ cart: param.returned })
        let resInv = await returnInventory({ cart: param.inventory, op: "add" })
        let resCnv = await returnConversion({ cart: param.conversion, op: "add" })
        let resReq = await updateRequest(param.request)
        let resRei = await createReimbursement(param.reimburse)
        if (resTrn.success && resDis.success && resRet.success && resInv.success && resCnv.success && resReq.success && resRei.success) {
            return { success: true, reimburse: resRei.result.insertId }
        }
        return { success: false }
    }

    const returnRequest = async () => {
        if (!onindex) return
        if (cart?.filter(f => f.id !== undefined).length === 0) return
        if (trans === "COMPLETED" && receipt.forreturn > 0 && !receipt.returnstatus) {
            if (window.confirm("Do you wish to create a return request for this transaction?")) {
                let param = {
                    request: {
                        code: transno.code,
                        prevvat: receipt.totalvat,
                        prevtotal: receipt.totalprice,
                        prevless: receipt.totaldiscount,
                        prevnet: receipt.netamount,
                        rtrnvat: receipt.returnvat,
                        rtrntotal: receipt.returnprice,
                        rtrnless: receipt.returndiscount,
                        rtrnnet: receipt.returnnet,
                        discount: receipt.applieddiscount || 0,
                        shift: shiftno,
                        requestedby: user.id,
                    },
                    dispense: cart?.map(item => {
                        return {
                            toreturn: item.toreturn,
                            id: item.id
                        }
                    })
                }
                let resReq = await createReturnRequest(param.request)
                let resDis = await updateDispensingByRequest({ cart: param.dispense })
                if (resReq.success && resDis.success) {
                    setreceipt(prev => ({
                        ...prev,
                        returnstatus: "REQUESTING"
                    }))
                    handleNotification({
                        type: 'success',
                        message: `Return request has been successfully created for transaction no. ${transno.code}`,
                    })
                }
            }
        }
    }

    const openTransaction = async (item) => {
        let res = await fetchDispensingByTransaction(item.code)
        let req = await fetchRequestByProgress(item.code, "")
        let trndiscount = item.less
        let resdiscount = res?.result?.reduce((prev, curr) => prev + amount(curr.less), 0)
        let drvdiscount = res?.result?.reduce((prev, curr) => prev + (amount(curr.less) * amount(curr.dispense)), 0)
        let imbadiscount = (trndiscount !== resdiscount)
        let calcdiscount = (trndiscount === drvdiscount)
        if (res?.result) {
            let logged = res?.result?.map(cart => {
                let tax = (cart?.vatable === "Y" ? vat : 0)
                let unit = cart?.price - (cart?.price * tax)
                let rate = cart?.discount ? (cart?.discount / 100) : 1
                let less = cart?.less ? ((cart?.toreturn * cart?.price) * (rate)) : 0
                if (imbadiscount && calcdiscount) {
                    less = cart?.less ? amount(cart?.less) * amount(cart?.dispense) : 0
                }
                // let less = ((cart?.toreturn * cart?.price) * (cart?.discount / 100)) || 0
                return {
                    ...cart,
                    acquisition: cart?.conv ? "CONVERSION" : "PROCUREMENT",
                    less: (imbadiscount && calcdiscount) ? less : cart?.less,
                    input: {
                        product: `${cart?.name} ${cart?.details} ${cart?.unit}`,
                        qty: cart?.dispense,
                        unit: unit,
                        vat: cart?.dispense * (cart?.price * tax),
                        price: cart?.dispense * cart?.price,
                        net: (cart?.dispense * cart?.price)
                    },
                    return: cart?.toreturn > 0 ? {
                        qty: cart?.toreturn,
                        unit: cart?.unit,
                        vat: cart?.toreturn * (cart?.price * cart?.taxrated),
                        price: cart?.toreturn * cart?.price,
                        less: less || 0,
                        net: (cart?.toreturn * cart?.price) - less
                    } : undefined,
                    returns: cart?.returned > 0 ? {
                        net: ((cart?.returned * cart?.price) - less) || 0
                    } : undefined
                }
            })
            setcart(logged)
            settrans(item.status)
            settransno(item)
            setreceipt(prev => ({
                ...prev,
                applieddiscount: item.discount,
                discountedcarts: res?.result?.filter(f => amount(f.less) > 0).length || 0,
                returnstatus: req?.result?.status === "CANCELLED" || req?.result?.status === "COMPLETED" || req?.result?.status === "DISAPPROVED" ? undefined : req?.result?.status,
                requestid: req?.result?.id,
                returntotal: logged?.reduce((prev, curr) => prev + amount(curr?.returned || 0), 0),
                returnvalue: logged?.reduce((prev, curr) => prev + amount(curr?.returns?.net || 0), 0)
            }))
            return true
        }
        return false
    }

    const endShift = () => {
        if (!onindex) return
        setonindex(false)
        setshowshift(true)
    }

    const returnCart = (item) => {
        setonindex(false)
        settoreturn(item)
        setshowreturn(true)
    }

    const cancelReturn = (item) => {
        if (window.confirm("Do you wish to cancel this return?")) {
            setcart(prev => prev?.map(cart => {
                if (cart.position === item.position) {
                    return {
                        ...cart,
                        dispense: amount(cart?.dispense) + amount(cart?.toreturn),
                        toreturn: 0,
                        return: {}
                    }
                }
                return cart
            }))
        }
    }

    useEffect(() => {
        if (shift === "START" && trans === "READY") {
            if (!showfind && item && !item?.input) {
                setonindex(false)
                setshowqty(true)
            }
        }
    }, [showfind, item?.input])

    useEffect(() => {
        if (cart?.length) {
            const totalprice = cart?.reduce((prev, curr) => prev + amount(curr?.input?.price), 0)
            const totalvat = cart?.reduce((prev, curr) => prev + amount(curr?.input?.vat), 0)
            const totaldiscount = cart?.reduce((prev, curr) => prev + amount(curr?.less), 0)
            const rawnetamount = cart?.reduce((prev, curr) => prev + amount(curr?.input?.net), 0)
            const netamount = cart?.reduce((prev, curr) => prev + amount(curr?.net), 0)
            const forreturn = cart?.reduce((prev, curr) => prev + amount(curr?.toreturn), 0)
            const returnvat = cart?.reduce((prev, curr) => prev + amount(curr?.return?.vat || 0), 0)
            const returnprice = cart?.reduce((prev, curr) => prev + amount(curr?.return?.price || 0), 0)
            const returndiscount = cart?.reduce((prev, curr) => prev + amount(curr?.return?.less || 0), 0)
            const returnnet = cart?.reduce((prev, curr) => prev + amount(curr?.return?.net || 0), 0)
            setreceipt(prev => ({
                ...prev,
                totalprice: amount(totalprice),
                totalvat: amount(totalvat),
                totaldiscount: amount(totaldiscount),
                rawnetamount: amount(rawnetamount),
                netamount: amount(netamount),
                forreturn: forreturn || 0,
                returnvat: amount(returnvat),
                returnprice: amount(returnprice),
                returndiscount: amount(returndiscount),
                returnnet: amount(returnnet),
            }))
            if (trans === "READY" && receipt.applieddiscount > 0 && cart.length !== receipt.discountedcarts)
                handleNotification({
                    type: 'error',
                    message: `Discount requires recalibration.`,
                })
        }
    }, [JSON.stringify(cart)])

    const recalibrate = (applieddiscount) => {
        let discountrate = (applieddiscount / 100)
        let appliedtocarts = cart?.length || 0
        setcart(cart?.map(item => {
            let lessamount = amount(item?.input?.price) * discountrate
            let netamount = amount(item?.input?.price) - lessamount
            return {
                ...item,
                discount: applieddiscount,
                less: amount(lessamount),
                net: amount(netamount),
                return: undefined
            }
        }))
        return appliedtocarts
    }

    return (
        <div className='flex flex-col py-2 px-2 min-h-full'>
            <div className="flex flex-col sm:items-center">
                <CasheringControl.Transactions
                    cart={cart}
                    shift={shift}
                    setshift={setshift}
                    trans={trans}
                    onindex={onindex}
                    action={{
                        startShift: () => startShift(),
                        newTransaction: () => newTransaction(),
                        cancelTransaction: () => cancelTransaction(),
                        paymentTransaction: () => paymentTransaction(),
                        findProduct: () => findProduct(),
                        transactionLogs: () => transactionLogs(),
                        returnRequest: () => viewRequests(),
                        openSchedules: () => openSchedules(),
                        endShift: () => endShift()
                    }}
                />
                <CasheringNotice
                    user="Administrator"
                    trans={trans}
                    shiftNo={shiftno}
                    orderNo={transno?.ordno}
                    transNo={transno?.code}
                    startCash={startcash}
                    drawerCash={drawercash}
                    transCount={transcount}
                />
            </div>
            <div ref={parRef} className="flex h-full w-full bg-yellow-400 flex-grow gap-[4px] p-1">
                <CasheringOrders
                    cart={cart}
                    setcart={setcart}
                    container={container}
                    trans={trans}
                    receipt={receipt}
                    returnCart={returnCart}
                    cancelReturn={cancelReturn}
                />
                <div className="flex flex-col w-fit bg-gradient-to-r from-primary-400 to-primary-500 text-white">
                    <CasheringReceipt
                        cart={cart}
                        receipt={receipt}
                    />
                    <CasheringControl.Toggles
                        cart={cart}
                        onindex={onindex}
                        trans={trans}
                        receipt={receipt}
                        action={{
                            applyDiscount: () => applyDiscount(),
                            commitReturn: () => commitReturn(),
                            returnRequest: () => returnRequest(),
                        }}
                    />
                    <div className="w-full flex flex-col no-select">
                        <div className="px-5">Net Amount:</div>
                        <div className="w-full text-center text-[45px] font-bold">
                            {currencyFormat.format(receipt.netamount || 0)}
                        </div>
                    </div>
                </div>
            </div>
            <CasheringCashier
                show={showshift}
                toggle={closeShift}
                user={user}
                shift={shift}
                setshift={setshift}
                setstartcash={setstartcash}
                drawercash={drawercash}
                setdrawercash={setdrawercash}
                shiftno={shiftno}
                setshiftno={setshiftno}
            />
            <CasheringBegin
                show={showtransaction}
                toggle={closeTransaction}
                shiftno={shiftno}
                settransno={settransno}
                setcart={setcart}
                setreceipt={setreceipt}
                settrans={settrans}
            />
            <CasheringProduct
                show={showfind}
                toggle={closeFind}
                cart={cart}
                setcart={setcart}
                setitem={setitem}
                transno={transno}
            />
            <CasheringQuantity
                show={showqty}
                toggle={closeQty}
                item={item}
                setitem={setitem}
                vat={vat}
                cart={cart}
                setcart={setcart}
                transno={transno}
            />
            <CasheringDiscount
                show={showdiscount}
                toggle={closeDiscount}
                net={receipt.rawnetamount || 0}
                recalibrate={recalibrate}
                setreceipt={setreceipt}
                transno={transno}
            />
            <CasheringPayment
                show={showpayment}
                toggle={closePayment}
                cart={cart}
                transno={transno}
                shiftno={shiftno}
                settrans={settrans}
                receipt={receipt}
            />
            <CasheringLogged
                show={showlogs}
                toggle={closeLogs}
                user={user}
                openTransaction={openTransaction}
            />
            <CasheringReturn
                show={showreturn}
                toggle={closeReturn}
                item={toreturn}
                cart={cart}
                setcart={setcart}
            />
            <CasheringRequest
                show={showrequest}
                toggle={closeRequest}
                shiftno={shiftno}
                setcart={setcart}
                vat={vat}
                settrans={settrans}
                settransno={settransno}
                setreceipt={setreceipt}
            />
            <CasheringReimburse
                show={showreimburse}
                toggle={closeReimburse}
                reimburse={reimburse}
                setreimburse={setreimburse}
                reimbursement={reimbursement}
                transno={transno}
                receipt={receipt}
                openTransaction={openTransaction}
            />
            <CasheringSchedule
                show={showschedule}
                toggle={closeSchedule}
            />
        </div>
    )
}

export default CasheringIndex