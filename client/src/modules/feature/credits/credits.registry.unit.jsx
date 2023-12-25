import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQueryClient } from "react-query"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import useYup from "../../../utilities/hooks/useYup"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import Active from "../../../utilities/interface/forminput/input.active"
import { balanceCustomer } from "../../library/customer/customer.services"
import { batchPayment, createCredits, fetchCreditsById, updateCredits } from "../cashering/cashering.service"
import CreditsPayment from "./credits.payment"

const CreditsRegistryUnit = ({ id, reference, show, setshow, currentShift }) => {
    const { handleNotification } = useNotificationContext()
    const { loading, setloading } = useClientContext()
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const [onreset, setonreset] = useState()
    const [settle, setsettle] = useState(0)
    const [payments, setpayments] = useState([])
    const [change, setchange] = useState(0)
    const [method, setmethod] = useState("CASH")
    const queryClient = useQueryClient()

    const toggleModalClose = () => {
        onreset?.reset()
        setshow(false)
    }

    const schema = yup.object().shape({})

    const fields = (errors, register, values, setValue, watch, reset) => {
        useEffect(() => {
            setonreset({ reset: () => reset() })
        }, [reset])

        return (
            <>
                <Active.Text
                    label="Creditor"
                    register={register}
                    name="name"
                    readOnly={true}
                    errors={errors}
                />
                <Active.Text
                    label="Transaction"
                    register={register}
                    name="code"
                    readOnly={true}
                    errors={errors}
                />
                <Active.Group>
                    <Active.Text
                        label="Net Amount"
                        register={register}
                        name="total"
                        readOnly={true}
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Text
                        label="Partial"
                        register={register}
                        name="partial"
                        readOnly={true}
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Text
                        label="Balance"
                        register={register}
                        name="balance"
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
                <CreditsPayment
                    values={values}
                    settle={settle}
                    setsettle={setsettle}
                    payments={payments}
                    setpayments={setpayments}
                    change={change}
                    setchange={setchange}
                    method={method}
                    setmethod={setmethod}
                    processPayment={processPayment}
                    loading={loading}
                    currentShift={currentShift}
                />
            </>
        )
    }

    useEffect(() => {
        if (id) {
            setloading(false)
            fetchCreditsById(id).then((ret) => {
                setsettle(amount(ret?.result?.balance))
                setpayments([])
                setmethod("CASH")
                setvalues(prev => ({
                    ...prev,
                    total: currencyFormat.format(ret?.result?.total),
                    partial: currencyFormat.format(ret?.result?.partial),
                    balance: currencyFormat.format(Number(ret?.result?.balance.toFixed(2))),
                    code: ret?.result?.code,
                }))
            })
        }
    }, [show, id])

    useEffect(() => {
        if (reference) {
            setvalues(prev => ({
                ...prev,
                name: reference.name
            }))
        }
    }, [reference])

    const processPayment = async () => {
        if (settle > 0) {
            handleNotification({
                type: 'error',
                message: `Please make sure that the amount to be settled is zero.`,
            })
            return
        }
        setloading(true)
        let waived = payments?.filter(f => f.method === "WAIVE")?.reduce((prev, curr) => prev + Number(curr?.amount), 0)
        let balance = payments?.filter(f => f.method === "BALANCE")?.reduce((prev, curr) => prev + Number(curr?.amount), 0)
        let tended = payments?.filter(f => f.method === "CASH")?.reduce((prev, curr) => prev + Number(curr?.amount), 0)
        let payment = payments?.filter(f => f.method !== "BALANCE" && f.method !== "WAIVE")?.reduce((prev, curr) => prev + Number(curr?.amount), 0)
        if ((waived + payment) === 0) {
            handleNotification({
                type: 'error',
                message: `There is no amount to settle for this account.`,
            })
            return
        }

        let param = {
            ongoing: balance > 0 ? {
                customer: reference.id,
                code: values.code,
                total: Number(values.total.replaceAll(",", "")),
                partial: Number(values.partial.replaceAll(",", "")) + Number(payment),
                balance: balance,
                waived: waived,
            } : undefined,
            update: {
                payment: payment,
                tended: tended,
                loose: change,
                waived: waived,
                status: balance === 0 ? "PAID" : "PARTIAL",
                settledon: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                id: id
            },
            payments: payments?.filter(pay => pay.type === "CREDIT")
        }
        if (balance > 0) {
            let resPartial = await createCredits(param.ongoing)
            let resUpdate = await updateCredits(param.update)
            let resBalance = await balanceCustomer({ id: reference?.id })
            let resPayment = await batchPayment({ payments: param.payments })
            queryClient.invalidateQueries("credits-item-index")
            setloading(false)
            if (resPartial.success && resUpdate.success && resBalance.success && resPayment.success) {
                setshow(false)
            }
            return
        }
        if (balance === 0) {
            let resUpdate = await updateCredits(param.update)
            let resBalance = await balanceCustomer({ id: reference?.id })
            let resPayment = await batchPayment({ payments: param.payments })
            queryClient.invalidateQueries("credits-item-index")
            setloading(false)
            if (resUpdate.success && resBalance.success && resPayment.success) {
                setshow(false)
            }
            return
        }
    }

    return (
        <>
            <AppModal show={show} setshow={toggleModalClose} title="Add Product">
                <div className="w-[600px] flex flex-col">
                    <DataInputs
                        id={id}
                        name='Delivery-Item'
                        values={values}
                        schema={schema}
                        fields={fields}
                        option={{
                            modal: true,
                            setshow: () => setshow(false)
                        }}
                    />
                </div>
            </AppModal>
        </>
    )
}

export default CreditsRegistryUnit