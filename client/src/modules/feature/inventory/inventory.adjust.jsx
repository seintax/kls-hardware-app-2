import React, { useEffect, useState } from 'react'
import { useQueryClient } from "react-query"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { processForm } from "../../../utilities/functions/query.functions"
import useYup from "../../../utilities/hooks/useYup"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import Active from "../../../utilities/interface/forminput/input.active"
import { adjustInventory, createInventoryAdjustment } from "./inventory.services"

const InventoryAdjust = ({ reference, show, setshow }) => {
    const { handleNotification } = useNotificationContext()
    const queryClient = useQueryClient()
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(undefined, 'Inventory-Adjustment', () => { }, createInventoryAdjustment)
    const [onreset, setonreset] = useState()
    const actions = [
        { value: "Plus", key: "Plus", data: "Plus" },
        { value: "Minus", key: "Minus", data: "Minus" },
    ]

    const toggleModalClose = () => {
        onreset?.reset()
        setshow(false)
    }

    const schema = yup.object().shape({
        operation: yup
            .string()
            .required('This is a required field.'),
        quantity: yup
            .number()
            .typeError("This is a required field.")
            .min(1, "This is a required field."),
        details: yup
            .string()
            .required('This is a required field.'),
    })

    const fields = (errors, register, values, setValue, watch, reset) => {
        useEffect(() => {
            setonreset({ reset: () => reset() })
        }, [reset])

        useEffect(() => {
            if (show) {
                const subscription = watch((value, { name }) => {
                    if (name === 'quantity') {
                        if (!value?.operation) return
                        setValue("newstocks", value?.operation === "Plus"
                            ? Number(reference?.stocks) + Number(value?.quantity)
                            : Number(reference?.stocks) - Number(value?.quantity))
                    }
                })
                return () => subscription.unsubscribe()
            }
        }, [watch, reference, show])

        return (
            <>
                <Active.Text
                    label="Product Name"
                    register={register}
                    name="product"
                    errors={errors}
                    autoComplete="off"
                    readOnly={true}
                />
                <Active.Group>
                    <Active.Text
                        label="Received"
                        register={register}
                        name="received"
                        errors={errors}
                        autoComplete="off"
                        readOnly={true}
                    />
                    <Active.Text
                        label="Stocks"
                        register={register}
                        name="stocks"
                        errors={errors}
                        autoComplete="off"
                        readOnly={true}
                    />
                </Active.Group>
                <Active.Group>
                    <Active.Select
                        label="Operation"
                        register={register}
                        name="operation"
                        errors={errors}
                        options={actions}
                    />
                    <Active.Decimal
                        label="Quantity"
                        register={register}
                        name="quantity"
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
                <Active.Text
                    label="New Stocks"
                    register={register}
                    name="newstocks"
                    errors={errors}
                    autoComplete="off"
                    readOnly={true}
                />
                <Active.Area
                    label="Details"
                    register={register}
                    name="details"
                    errors={errors}
                    autoComplete="off"
                />
                <Active.Area
                    label="Remarks"
                    register={register}
                    name="remarks"
                    errors={errors}
                    autoComplete="off"
                />
            </>
        )
    }

    useEffect(() => {
        if (show) {
            setvalues({
                product: `${reference?.name} ${reference?.details} ${reference?.unit}`,
                received: reference?.received,
                stocks: reference?.stocks,
                operation: "Plus",
                quantity: "",
                details: "",
                remarks: ""
            })
        }
    }, [show, reference])

    const submit = async (data) => {
        if (data?.details?.length > 99) {
            handleNotification({
                type: 'error',
                message: "Details have exceeded 99 characters."
            })
            return
        }
        if (data?.remarks?.length > 99) {
            handleNotification({
                type: 'error',
                message: "Remarks have exceeded 99 characters."
            })
            return
        }
        let param = {
            inventory: {
                stocks: data.newstocks,
                id: reference.id
            },
            adjustment: {
                item: reference.id,
                product: reference.product,
                conv: reference.acquisition === "CONVERSION" ? reference.conv : 0,
                price: reference.price,
                oldstocks: reference.stocks,
                operator: data.operation,
                quantity: data.quantity,
                newstocks: data.newstocks,
                details: data.details,
                remarks: data.remarks,
            }
        }

        mutate(param.adjustment)
        let res = await adjustInventory(reference.id, data.quantity, data?.operation === "Plus" ? "add" : "minus")
        queryClient.invalidateQueries(`inventory-index`)
        if (res.success) {
            setshow(false)
        }
    }

    return (
        <>
            <AppModal show={show} setshow={toggleModalClose} title="Stock Adjustment">
                <div className="w-[600px] flex flex-col">
                    <DataInputs
                        name='Inventory-Prices'
                        values={values}
                        schema={schema}
                        fields={fields}
                        submit={submit}
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

export default InventoryAdjust