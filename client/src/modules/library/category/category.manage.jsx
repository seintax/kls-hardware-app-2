import React, { useEffect, useState } from 'react'
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Active from "../../../utilities/interface/forminput/input.active"
import { createCategory, fetchCategoryById, updateCategory } from './category.services'

const CategoryManage = ({ id, name, manage }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateCategory, createCategory)

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('This is a required field.'),
    })

    const fields = (errors, register) => {
        return (
            <>
                <Active.Text
                    label='Category Name'
                    register={register}
                    name='name'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
            </>
        )
    }

    useEffect(() => {
        if (id) {
            fetchCategoryById(id).then((ret) => {
                setvalues({
                    name: ret?.result?.name,
                })
            })
        }
    },
        [id])

    const submit = (data) => {
        let param = {
            name: data.name,
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

export default CategoryManage