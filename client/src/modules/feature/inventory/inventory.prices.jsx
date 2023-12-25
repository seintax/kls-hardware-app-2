import React, { useEffect, useState } from 'react'
import { useQueryClient } from "react-query"
import { currencyFormat } from "../../../utilities/functions/number.funtions"
import { processForm } from "../../../utilities/functions/query.functions"
import useYup from "../../../utilities/hooks/useYup"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import Active from "../../../utilities/interface/forminput/input.active"
import { createInventoryPrice, updateInventory } from "./inventory.services"

const InventoryPrices = ({ reference, show, setshow }) => {
    const queryClient = useQueryClient()
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(undefined, 'Inventory-Prices', () => { }, createInventoryPrice)
    const [onreset, setonreset] = useState()

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
                    label="Product Name"
                    register={register}
                    name="product"
                    errors={errors}
                    autoComplete="off"
                    readOnly={true}
                />
                <Active.Group>
                    <Active.Text
                        label="Item Cost"
                        register={register}
                        name="cost"
                        errors={errors}
                        autoComplete="off"
                        readOnly={true}
                    />
                    <Active.Text
                        label="Current Price"
                        register={register}
                        name="oldprice"
                        errors={errors}
                        autoComplete="off"
                        readOnly={true}
                    />
                </Active.Group>
                <Active.Currency
                    label="New Price"
                    register={register}
                    name="newprice"
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
                cost: currencyFormat.format(reference?.cost.toFixed(2)),
                oldprice: currencyFormat.format(reference?.price.toFixed(2)),
                newprice: ""
            })
        }
    }, [show, reference])

    const submit = async (data) => {
        let param = {
            inventory: {
                price: data.newprice,
                id: reference.id
            },
            price: {
                item: reference.id,
                product: reference.product,
                conv: reference.acquisition === "CONVERSION" ? reference.conv : 0,
                stocks: reference.stocks,
                oldprice: data.oldprice,
                newprice: data.newprice,
                acquisition: reference.acquisition,
            }
        }
        let res = await updateInventory(param.inventory)
        if (res.success) {
            queryClient.invalidateQueries(`inventory-index`)
            mutate(param.price)
            setshow(false)
        }
    }

    return (
        <>
            <AppModal show={show} setshow={toggleModalClose} title="Change Price">
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

export default InventoryPrices