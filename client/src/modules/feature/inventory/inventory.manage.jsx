import React, { useEffect, useState } from 'react'
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Email from '../../../utilities/interface/forminput/input.email'
import Group from '../../../utilities/interface/forminput/input.group'
import Text from '../../../utilities/interface/forminput/input.text'
import { createInventory, fetchInventoryById, updateInventory } from './inventory.services'

const InventoryManage = ({ id, name, manage }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateInventory, createInventory)

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('This is a required field.'),
        address: yup
            .string()
            .required('This is a required field.'),
        contact: yup
            .string()
            .required('This is a required field.'),
    })

    const fields = (errors, register) => {
        return (
            <>
                <Text
                    label='Inventory Name'
                    register={register}
                    name='name'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <Text
                    label='Address'
                    register={register}
                    name='address'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-3/4'
                />
                <Group style='lg:w-1/2'>
                    <Text
                        label='Contact No.'
                        register={register}
                        name='contact'
                        errors={errors}
                        autoComplete='off'
                    />
                    <Email
                        label='Email Address'
                        register={register}
                        name='email'
                        errors={errors}
                        autoComplete='off'
                    />
                </Group>
            </>
        )
    }

    useEffect(() => {
        if (id) {
            fetchInventoryById(id).then((ret) => {
                setvalues({
                    name: ret?.result?.name,
                    address: ret?.result?.address,
                    contact: ret?.result?.contact,
                    email: ret?.result?.email,
                })
            })
        }
    },
        [id])

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

export default InventoryManage