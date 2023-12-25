import React, { useEffect, useState } from 'react'
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Active from "../../../utilities/interface/forminput/input.active"
import { createMeasurement, fetchMeasurementById, updateMeasurement } from './measurement.services'

const MeasurementManage = ({ id, name, manage }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateMeasurement, createMeasurement)

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('This is a required field.'),
        code: yup
            .string()
            .required('This is a required field.'),
        qty: yup
            .number()
            .required('This is a required field.'),
        method: yup
            .string()
            .required('This is a required field.'),
    })

    const fields = (errors, register, values, setValue, watch) => {
        useEffect(() => {
            const subscription = watch((value, { name }) => {
                if (name === 'code' || name === 'qty') {
                    let display = ""
                    if (value.code && value.qty)
                        display = `per ${value.qty == 1 ? "" : `${value.qty} `}${value.code}`
                    setValue("display", display)
                }
            })
            return () => subscription.unsubscribe()
        }, [watch])

        return (
            <>
                <Active.Text
                    label="Description"
                    register={register}
                    name="name"
                    errors={errors}
                    autoComplete="off"
                    required
                    wrapper="lg:w-1/2"
                />
                <Active.Group style="lg:w-1/2">
                    <Active.Text
                        label="Unit Code"
                        register={register}
                        name="code"
                        errors={errors}
                        autoComplete="off"
                        maxLength={6}
                        required
                    />
                    <Active.Number
                        label="Unit Quantity (qty per unit sold)"
                        register={register}
                        name="qty"
                        errors={errors}
                        autoComplete="off"
                        defaultValue={1}
                        required
                    />
                </Active.Group>
                <Active.Group style="lg:w-1/2">
                    <Active.Text
                        label='Display'
                        register={register}
                        name='display'
                        errors={errors}
                        autoComplete='off'
                        readOnly={true}
                    />
                    <Active.Select
                        label="Sales Method"
                        register={register}
                        name="method"
                        options={["By Item", "By Volume"]}
                        errors={errors}
                        required
                    />
                </Active.Group>
            </>
        )
    }

    useEffect(() => {
        if (id) {
            fetchMeasurementById(id).then((ret) => {
                setvalues({
                    name: ret?.result?.name,
                    code: ret?.result?.code,
                    qty: ret?.result?.qty,
                    display: ret?.result?.display,
                    method: ret?.result?.method,
                })
            })
        }
    }, [id])

    const submit = (data) => {
        let param = {
            name: data.name,
            code: data.code,
            qty: data.qty,
            display: data.display,
            method: data.method,
        }
        if (id) param = { ...param, id: id }
        mutate(param)
        manage(false)
    }

    return (
        <DataInputs
            id={id}
            name={name}
            values={values}
            schema={schema}
            fields={fields}
            submit={submit}
            manage={manage}
        />
    )
}

export default MeasurementManage