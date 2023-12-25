import moment from "moment"
import React, { useEffect, useState } from 'react'
import { processForm } from "../../../utilities/functions/query.functions"
import useYup from "../../../utilities/hooks/useYup"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import Active from "../../../utilities/interface/forminput/input.active"
import ArrayVariables from "../../../utilities/variables/array.variables"
import { createInventory, fetchInventoryById, updateInventory } from "../inventory/inventory.services"
import { libraryMasterlist } from "../masterlist/masterlist.services"
import { balanceDelivery } from "./delivery.services"

const DeliveryRegistryUnit = ({ id, reference, show, setshow }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, 'Delivery-Item', updateInventory, createInventory, balanceDelivery({ id: reference?.id }))
    const [instantiated, setinstantiated] = useState(false)
    const [product, setproduct] = useState()
    const [onreset, setonreset] = useState()

    const toggleModalClose = () => {
        onreset?.reset()
        setshow(false)
    }

    const schema = yup.object().shape({
        product: yup
            .number()
            .required('This is a required field.'),
        received: yup
            .number()
            .required('This is a required field.'),
        cost: yup
            .number()
            .required('This is a required field.'),
        stocks: yup
            .number()
            .required('This is a required field.'),
        price: yup
            .number()
            .required('This is a required field.'),
        receipt: yup
            .string()
            .required('This is a required field.'),
        sku: yup
            .string()
            .required('This is a required field.'),
        vatable: yup
            .string()
            .required('This is a required field.'),
        isloose: yup
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
                    if (name === 'received') {
                        setValue("stocks", value.received)
                    }
                    if (name === 'product') {
                        let prod = value.product
                        if (prod) {
                            let arr = product?.filter(f => f.value.toString() === prod.toString())
                            let tags = arr[0]
                            setValue("receipt", tags.data.receipt)
                            setValue("sku", tags.data.sku)
                            setValue("productdata", tags.data)
                        }
                        else {
                            setValue("receipt", "")
                            setValue("sku", "")
                            setValue("productdata", undefined)
                        }
                    }
                })
                return () => subscription.unsubscribe()
            }
        }, [watch, product, show])

        return (
            <>
                <Active.Select
                    label="Product Name"
                    register={register}
                    name="product"
                    options={product}
                    errors={errors}
                />
                <Active.Group>
                    <Active.Number
                        label="Delivered Quantity"
                        register={register}
                        name="received"
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Currency
                        label="Item Cost (per unit)"
                        register={register}
                        name="cost"
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
                <Active.Group>
                    <Active.Number
                        label="Inventory stocks"
                        register={register}
                        name="stocks"
                        readOnly={true}
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Currency
                        label="Item Price (per unit)"
                        register={register}
                        name="price"
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
                <Active.Text
                    label="Receipt Name"
                    register={register}
                    name="receipt"
                    errors={errors}
                    autoComplete="off"
                    style="uppercase"
                />
                <Active.Text
                    label="SKU"
                    register={register}
                    name="sku"
                    errors={errors}
                    autoComplete="off"
                />
                <Active.Group>
                    <Active.Select
                        label="Vatable"
                        register={register}
                        name="vatable"
                        defaultValue={"Y"}
                        options={ArrayVariables.booleans}
                        errors={errors}
                    />
                    <Active.Select
                        label="Sold by Decimal Qty"
                        register={register}
                        name="isloose"
                        defaultValue={"N"}
                        options={ArrayVariables.booleans}
                        errors={errors}
                    />
                </Active.Group>
                <Active.Group>
                    <Active.Text
                        label="Brand"
                        register={register}
                        name="brand"
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Text
                        label="Model"
                        register={register}
                        name="model"
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
            </>
        )
    }

    useEffect(() => {
        if (show) {
            const instantiate = async () => {
                setproduct(await libraryMasterlist())
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
                    product: ret?.result?.product,
                    received: ret?.result?.received,
                    cost: ret?.result?.cost,
                    stocks: ret?.result?.stocks,
                    price: ret?.result?.price,
                    vatable: ret?.result?.vatable,
                    receipt: ret?.result?.receipt,
                    sku: ret?.result?.sku,
                    isloose: ret?.result?.isloose,
                    brand: ret?.result?.brand,
                    model: ret?.result?.model,
                })
            })
        }
    }, [id, instantiated])

    const submit = async (data) => {
        let param = {
            product: data.product,
            received: data.received,
            cost: data.cost,
            stocks: data.stocks,
            price: data.price,
            vatable: data.vatable,
            receipt: data.receipt.toUpperCase(),
            sku: data.sku,
            isloose: data.isloose,
            brand: data.brand,
            model: data.model,
            supplier: reference.name,
            drno: reference.drno,
            drdate: moment(reference.date).format("YYYY-MM-DD"),
            category: data.productdata.category,
            name: data.productdata.name,
            details: data.productdata.details,
            unit: data.productdata.unit,
            reference: reference.id
        }
        if (id) param = { ...param, id: id }
        mutate(param)
        setshow(false)
    }

    useEffect(() => {
    }, [reference])


    return (
        <>
            <AppModal show={show} setshow={toggleModalClose} title="Add Product">
                DR No.{reference?.drno}
                <div className="w-[600px] flex flex-col">
                    <DataInputs
                        id={id}
                        name='Delivery-Item'
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

export default DeliveryRegistryUnit