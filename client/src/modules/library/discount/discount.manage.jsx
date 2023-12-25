import React, { useEffect, useState } from 'react'
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Active from "../../../utilities/interface/forminput/input.active"
import { createDiscount, fetchDiscountById, updateDiscount } from './discount.services'

const DiscountManage = ({ id, name, manage }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateDiscount, createDiscount)

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('This is a required field.'),
        percent: yup
            .number()
            .required('This is a required field.'),
    })

    const fields = (errors, register, values, setValue, watch) => {
        useEffect(() => {
            const subscription = watch((value, { name }) => {
                if (name === 'percent') {
                    let rate = Number(value.percent) || 0
                    if (rate > 0)
                        setValue("rate", rate / 100)
                    else
                        setValue("rate", 0)
                }
            })
            return () => subscription.unsubscribe()
        }, [watch])

        return (
            <>
                <Active.Text
                    label='Discount Name'
                    register={register}
                    name='name'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <Active.Group style="lg:w-1/2">
                    <Active.Percent
                        label='Percent (%)'
                        register={register}
                        name='percent'
                        errors={errors}
                        autoComplete='off'
                    />
                    <Active.Text
                        label='Rate Equivalent'
                        register={register}
                        name='rate'
                        errors={errors}
                        autoComplete='off'
                        readOnly={true}
                    />
                </Active.Group>
            </>
        )
    }

    useEffect(() => {
        if (id) {
            fetchDiscountById(id).then((ret) => {
                setvalues({
                    name: ret?.result?.name,
                    percent: ret?.result?.percent,
                    rate: ret?.result?.rate,
                })
            })
        }
    }, [id])

    const submit = (data) => {
        let param = {
            name: data.name,
            percent: data.percent,
            rate: data.rate
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

export default DiscountManage