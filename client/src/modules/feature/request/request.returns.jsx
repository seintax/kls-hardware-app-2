import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQueryClient } from "react-query"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import { fetchDispensingByTransaction } from "../cashering/cashering.service"
import { updateRequest } from "./request.services"

const RequestReturn = ({ show, toggle, request }) => {
    const { handleNotification } = useNotificationContext()
    const { user } = useClientContext()
    const queryClient = useQueryClient()
    const [cart, setcart] = useState([])

    const getData = async () => {
        let res = await fetchDispensingByTransaction(request.code)
        setcart(res?.result)
    }

    useEffect(() => {
        if (show) {
            getData()
        }
    }, [show])

    const approveRequest = async () => {
        if (window.confirm("Do you wish to approve this request?")) {
            let param = {
                authorizeby: user.id,
                authorizeon: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                status: "APPROVED",
                id: request.id
            }
            let res = await updateRequest(param)
            if (res.success) {
                queryClient.invalidateQueries(`request-index`)
                handleNotification({
                    type: 'success',
                    message: `Request for ${request.code} has been approved.`,
                })
                toggle()
            }
        }
    }

    const disapproveRequest = async () => {
        if (window.confirm("Do you wish to disapprove this request?")) {
            let param = {
                status: "DISAPPROVED",
                id: request.id
            }
            let res = await updateRequest(param)
            if (res.success) {
                queryClient.invalidateQueries(`request-index`)
                handleNotification({
                    type: 'success',
                    message: `Request for ${request.code} has been disapproved.`,
                })
                toggle()
            }
        }
    }

    return (
        <AppModal show={show} setshow={toggle} title="Return Request">
            <div className="w-[1000px] flex flex-col py-3 gap-[20px] no-select">
                <div className="w-full flex flex-col text-xs">
                    <div className="flex w-full bg-gray-300 p-2 gap-[5px]">
                        <div className="w-full flex">Product Name</div>
                        <div className="w-[180px] text-center">Purchase Qty</div>
                        <div className="w-[200px] text-right">Total</div>
                        <div className="w-[200px] text-right">Discount</div>
                        <div className="w-[200px] text-right">Net Amount</div>
                        <div className="w-[200px] text-center">Return Qty</div>
                        <div className="w-[200px] text-right">Return Price</div>
                        <div className="w-[220px] text-right">Remaining Net</div>
                    </div>
                    <div className="flex flex-col w-full max-h-[500px] overflow-y-auto">
                        {
                            (cart?.map((item, index) => (
                                <div key={index} className="flex w-full p-2 gap-[5px]">
                                    <div className="w-full flex">
                                        {item.name} {item.details} {item.unit}
                                    </div>
                                    <div className="w-[180px] text-center">
                                        {item.dispense}
                                    </div>
                                    <div className="w-[200px] text-right">
                                        {currencyFormat.format((item.price * item.dispense) || 0)}
                                    </div>
                                    <div className="w-[200px] text-right">
                                        {currencyFormat.format((item.less * -1) || 0)}
                                    </div>
                                    <div className="w-[200px] text-right">
                                        {currencyFormat.format(item.net || 0)}
                                    </div>
                                    <div className="w-[200px] text-center">
                                        {item.toreturn * -1}
                                    </div>
                                    <div className="w-[200px] text-right">
                                        {currencyFormat.format((item.price * item.toreturn * -1) || 0)}
                                    </div>
                                    <div className="w-[220px] text-right">
                                        {currencyFormat.format((item.net - ((item.price * item.toreturn) - (((item.toreturn * item.price) * (item.discount / 100)) || 0))) || 0)}
                                    </div>
                                </div>
                            )))
                        }
                        <div className="flex w-full mt-2">
                            <div className="py-2 px-2 w-full">
                            </div>
                            <div className="py-2 px-2 w-[200px] text-center">
                            </div>
                            <div className="py-2 px-2 w-[200px] text-right">
                            </div>
                            <div className="py-2 px-2 w-[200px] text-right">
                            </div>
                            <div className="py-2 px-2 w-[200px] text-center">
                            </div>
                            <div className="py-2 px-2 w-[200px] text-right">
                            </div>
                            <div className="py-2 px-2 w-[220px] text-right border-t border-t-gray-400 font-bold">
                                {currencyFormat.format(cart.reduce((prev, curr) => prev + (curr.net - ((curr.price * curr.toreturn) - (((curr.toreturn * curr.price) * (curr.discount / 100)) || 0))), 0))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full mt-5 gap-[10px]">
                    <button className="button-blue" onClick={() => approveRequest()}>
                        Approve Request
                    </button>
                    <button className="button-red" onClick={() => disapproveRequest()}>
                        Disapprove Request
                    </button>
                </div>
            </div>
        </AppModal>
    )
}

export default RequestReturn