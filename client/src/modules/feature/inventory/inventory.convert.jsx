import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useQueryClient } from "react-query"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import useYup from "../../../utilities/hooks/useYup"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import Active from "../../../utilities/interface/forminput/input.active"
import ArrayVariables from "../../../utilities/variables/array.variables"
import { libraryMeasurement } from "../../library/measurement/measurement.services"
import { convertInventory, createConversion } from "./inventory.services"

const InventoryConvert = ({ id, reference, show, setshow }) => {
    const { handleNotification } = useNotificationContext()
    const queryClient = useQueryClient()
    const [values, setvalues] = useState()
    const { yup } = useYup()
    // const { mutate } = processForm(undefined, 'Inventory-Convert', () => { }, createConversion)
    const [instantiated, setinstantiated] = useState(false)
    const [measurement, setmeasurement] = useState()
    const [onreset, setonreset] = useState()
    const [summary, setsummary] = useState({
        costconverted: 0,
        priceconverted: 0,
        recommendprice: 0,
        outputprice: 0
    })

    const toggleModalClose = () => {
        onreset?.reset()
        setshow(false)
    }

    const schema = yup.object().shape({
        itemqty: yup
            .number()
            .required('This is a required field.'),
        convunit: yup
            .string()
            .required('This is a required field.'),
        convqty: yup
            .number()
            .required('This is a required field.'),
        price: yup
            .number()
            .required('This is a required field.'),
        isloose: yup
            .string()
            .required('This is a required field.'),
        receipt: yup
            .string()
            .max(20, "Maximum of 20 characters")
            .required('This is a required field.')
    })

    const fields = (errors, register, values, setValue, watch, reset) => {
        useEffect(() => {
            setonreset({ reset: () => reset() })
        }, [reset])

        useEffect(() => {
            if (show) {
                const subscription = watch((value, { name }) => {
                    if (name === 'itemqty' || name === 'convqty' || name === 'price') {
                        let denom = value.itemqty ? (Number(value.convqty || 0) / Number(value.itemqty || 0)) : 0
                        let recomm = denom ? Number(value.itemprice.replaceAll(",", "")) / denom : 0
                        let output = value.price ? Number(value.price) * Number(value.convqty) : Number(recomm) * Number(value.convqty)
                        setsummary(prev => ({
                            ...prev,
                            costconverted: Number(value.itemqty || 0) * Number(value.itemcost.replaceAll(",", "")),
                            priceconverted: Number(value.itemqty || 0) * Number(value.itemprice.replaceAll(",", "")),
                            recommendprice: recomm,
                            outputprice: output
                        }))
                    }
                    if (name === 'convunit') {
                        let meas = measurement?.filter(f => f.value === value.convunit)
                        if (meas.length) {
                            let code = meas[0]?.data?.name?.replaceAll(" ", "").slice(0, 3)
                            setValue("receipt", `${reference.receipt}${code || ""}`)
                        }
                    }
                })
                return () => subscription.unsubscribe()
            }
        }, [watch, show])

        return (
            <>
                <Active.Display
                    label="Product Item"
                    register={register}
                    name="product"
                />
                <Active.Group>
                    <Active.Display
                        label="Inventory Cost per Unit"
                        register={register}
                        name="itemcost"
                    />
                    <Active.Display
                        label="Inventory Price per Unit"
                        register={register}
                        name="itemprice"
                    />
                </Active.Group>
                <Active.Display
                    label="Stocks Available"
                    register={register}
                    name="itemstocks"
                />
                <Active.Group>
                    <Active.Number
                        label="Qty to Convert"
                        register={register}
                        name="itemqty"
                        errors={errors}
                        autoComplete="off"
                        required
                    />
                    <div className="flex flex-col w-full gap-[6px] pl-4 border border-1 border-gray-300 text-sm py-1">
                        <div>Total Cost Converted: {currencyFormat.format(summary.costconverted)}</div>
                        <div>Total Price Converted: {currencyFormat.format(summary.priceconverted)}</div>
                    </div>
                </Active.Group>
                <Active.Group>
                    <Active.Select
                        label="Output Unit"
                        register={register}
                        name="convunit"
                        errors={errors}
                        options={measurement?.filter(f => f.value !== reference.unit)}
                        required
                    />
                    <Active.Number
                        label="Output Qty"
                        register={register}
                        name="convqty"
                        errors={errors}
                        autoComplete="off"
                        required
                    />
                </Active.Group>
                <Active.Group>
                    <Active.Currency
                        label="Output Price"
                        register={register}
                        name="price"
                        errors={errors}
                        autoComplete="off"
                        required
                    />
                    <div className="flex flex-col w-full gap-[6px] pl-4 border border-1 border-gray-300 text-sm py-1">
                        <div>Recommended Price: {currencyFormat.format(summary.recommendprice)}</div>
                        <div>Projected Sales: {currencyFormat.format(summary.outputprice)}</div>
                    </div>
                </Active.Group>
                <Active.Group>
                    <Active.Text
                        label="Receipt Name"
                        register={register}
                        name="receipt"
                        errors={errors}
                        required
                    />
                    <Active.Select
                        label="Sold by Decimal Qty"
                        register={register}
                        name="isloose"
                        defaultValue={"Y"}
                        options={ArrayVariables.booleans}
                        errors={errors}
                        required
                    />
                </Active.Group>
            </>
        )
    }

    useEffect(() => {
        const instantiate = async () => {
            setmeasurement(await libraryMeasurement())
            setinstantiated(true)
        }

        instantiate()
    }, [])

    useEffect(() => {
        if (reference && instantiated && show) {
            if (id) {
                setvalues({
                    product: `${reference.name} ${reference.details} ${reference.unit} (${reference.drno}-${moment(reference.drdate).format("YYYY-MM-DD")})`,
                    itemunit: reference.unit,
                    itemcost: currencyFormat.format(reference.cost),
                    itemprice: currencyFormat.format(reference.price),
                    itemstocks: reference.stocks,
                    itemqty: reference.itemqty,
                    convunit: reference.convunit,
                    convqty: reference.convqty,
                    price: reference.price,
                    receipt: reference.receipt
                })
                return
            }
            setvalues({
                product: `${reference.name} ${reference.details} ${reference.unit} (${reference.drno}-${moment(reference.drdate).format("YYYY-MM-DD")})`,
                itemunit: reference.unit,
                itemcost: currencyFormat.format(reference.cost),
                itemprice: currencyFormat.format(reference.price),
                itemstocks: reference.stocks,
                itemqty: "",
                convunit: "",
                convqty: "",
                price: "",
                receipt: reference.receipt
            })
        }
    }, [id, reference, instantiated, show])

    const submit = async (data) => {
        let param = {
            convert: {
                item: reference.id,
                product: reference.product,
                sku: reference.sku,
                itemunit: data.itemunit,
                itemqty: data.itemqty,
                convunit: data.convunit,
                convqty: data.convqty,
                stocks: data.convqty,
                cost: summary.recommendprice,
                price: data.price,
                receipt: data.receipt,
                vatable: "N",
                isloose: data.isloose,
                brand: "",
                model: "",
                supplier: reference.supplier,
                drno: reference.drno,
                drdate: moment(reference.drdate).format("YYYY-MM-DD"),
                category: reference.category,
                name: reference.name,
                details: reference.details,
                unit: reference.unit,
            },
            inventory: {
                qty: data.itemqty,
                amt: Number(data.itemqty) * Number(reference.price),
                id: reference.id
            }
        }
        let resConv = await createConversion(param.convert)
        let resInvt = await convertInventory(param.inventory)
        if (resConv.success && resInvt.success) {
            handleNotification({
                type: 'success',
                message: "Item has been successfully converted."
            })
            queryClient.invalidateQueries(`inventory-index`)
            queryClient.invalidateQueries(`conversion-index`)
            setshow(false)
        }
    }

    return (
        <>
            <AppModal show={show} setshow={toggleModalClose} title="Item Conversion">
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

export default InventoryConvert