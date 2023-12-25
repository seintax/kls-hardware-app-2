import React, { useEffect, useState } from 'react'
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Active from "../../../utilities/interface/forminput/input.active"
import { createCustomer, fetchCustomerById, updateCustomer } from './customer.services'

const CustomerManage = ({ id, name, manage }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateCustomer, createCustomer)
    const [instantiated, setinstantiated] = useState(false)

    const schema = yup.object().shape({
        name: yup
            .string()
            .required("This is a required field."),
        address: yup
            .string()
            .required("This is a required field."),
        contact: yup
            .string()
            .required("This is a required field."),
    })

    const fields = (errors, register, values, setValue, watch) => {
        return (
            <>
                <Active.Text
                    label="Customer Name"
                    register={register}
                    name="name"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-1/2"
                />
                <Active.Text
                    label="Address"
                    register={register}
                    name="address"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-3/4"
                />
                <Active.Group style="lg:w-1/2">
                    <Active.Text
                        label="Contact No."
                        register={register}
                        name="contact"
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Email
                        label="Email Address"
                        register={register}
                        name="email"
                        errors={errors}
                        autoComplete="off"
                    />
                </Active.Group>
            </>
        )
    }

    useEffect(() => {
        const instantiate = async () => {
            setinstantiated(true)
        }

        instantiate()
        return () => {
            setinstantiated(false)
        }
    }, [])

    useEffect(() => {
        if (id && instantiated) {
            fetchCustomerById(id).then((ret) => {
                setvalues({
                    name: ret?.result?.name,
                    address: ret?.result?.address,
                    contact: ret?.result?.contact,
                    email: ret?.result?.email,
                })
            })
        }
    }, [id, instantiated])

    const submit = (data) => {
        let param = {
            name: data.name,
            address: data.address,
            contact: data.contact,
            email: data.email,
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

export default CustomerManage