import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { processForm } from "../../../utilities/functions/query.functions"
import { generateZeros } from "../../../utilities/functions/string.functions"
import useYup from "../../../utilities/hooks/useYup"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import Active from "../../../utilities/interface/forminput/input.active"
import { fetchInventoryById, libraryInventory, transferInventory } from "../inventory/inventory.services"
import { balanceTransfer, createTransported, updateTransported } from "./transfer.services"

const TransferRegistryUnit = ({ id, reference, show, setshow }) => {
    const { handleNotification } = useNotificationContext()
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, 'Transfer-Item', updateTransported, createTransported, balanceTransfer({ id: reference?.id }))
    const [instantiated, setinstantiated] = useState(false)
    const [inventory, setinventory] = useState()
    const [onreset, setonreset] = useState()

    const toggleModalClose = () => {
        onreset?.reset()
        setshow(false)
    }

    const schema = yup.object().shape({
        item: yup
            .number()
            .required('This is a required field.'),
        product: yup
            .string()
            .required('This is a required field.'),
        stocks: yup
            .number()
            .required('This is a required field.'),
        cost: yup
            .number()
            .required('This is a required field.'),
        price: yup
            .number()
            .required('This is a required field.'),
        qty: yup
            .number()
            .required('This is a required field.'),
    })

    const fields = (errors, register, values, setValue, watch, reset) => {
        useEffect(() => {
            setonreset({ reset: () => reset() })
        }, [reset])

        useEffect(() => {
            const subscription = watch((value, { name }) => {
                if (name === 'item') {
                    let prod = value.item
                    if (prod) {
                        let arr = inventory?.filter(f => f.value.toString() === prod.toString())
                        let tags = arr[0]
                        setValue("stocks", tags.data.stocks)
                        setValue("cost", tags.data.cost)
                        setValue("price", tags.data.price)
                        setValue("product", generateZeros(tags.data.product, 10))
                    }
                    else {
                        setValue("stocks", "")
                        setValue("cost", "")
                        setValue("price", "")
                        setValue("product", "")
                    }
                }
            })
            return () => subscription.unsubscribe()
        }, [watch, inventory])

        return (
            <>
                <Active.Select
                    label="Product Name"
                    register={register}
                    name="item"
                    options={inventory}
                    errors={errors}
                />
                <Active.Text
                    label="Product Code"
                    register={register}
                    name="product"
                    readOnly={true}
                    errors={errors}
                    autoComplete="off"
                />
                <Active.Group>
                    <Active.Number
                        label="Remaining Quantity"
                        register={register}
                        name="stocks"
                        readOnly={true}
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Currency
                        label="Item Cost (per unit)"
                        register={register}
                        name="cost"
                        readOnly={true}
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
                <Active.Group>
                    <Active.Number
                        label="Quantity to Transfer"
                        register={register}
                        name="qty"
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Currency
                        label="Item Price (per unit)"
                        register={register}
                        name="price"
                        readOnly={true}
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
            </>
        )
    }

    useEffect(() => {
        if (show) {
            setvalues()
            const instantiate = async () => {
                setinventory(await libraryInventory())
                setinstantiated(true)
            }
            instantiate()
        }
        return () => {
            setinstantiated(false)
        }
    }, [show])

    useEffect(() => {
        if (id && instantiated) {
            fetchInventoryById(id).then((ret) => {
                setvalues({
                    item: ret?.result?.item,
                    product: ret?.result?.product,
                    qty: ret?.result?.qty,
                    cost: ret?.result?.cost,
                    stocks: ret?.result?.stocks,
                    price: ret?.result?.price,
                })
            })
        }
    }, [id, instantiated])

    const submit = async (data) => {
        if (data.stocks < data.qty) {
            handleNotification({
                type: 'error',
                message: `Not enough remaining balance.`,
            })
            return
        }
        let param = {
            item: data.item,
            product: Number(data.product),
            qty: data.qty,
            cost: data.cost,
            price: data.price,
            trno: reference.trno,
            trdate: moment(reference.date).format("YYYY-MM-DD"),
            reference: reference.id
        }
        if (id) param = { ...param, id: id }
        await transferInventory(data.item, data.qty, "minus")
        mutate(param)
        setshow(false)
    }

    return (
        <>
            <AppModal show={show} setshow={toggleModalClose} title="Add Product to Transport">
                <div className="w-[600px] flex flex-col">
                    <DataInputs
                        id={id}
                        name='Transfer-Item'
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

export default TransferRegistryUnit