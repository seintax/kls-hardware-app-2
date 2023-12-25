import React, { useEffect, useState } from 'react'
import { useClientContext } from "../../../utilities/context/client.context"
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Active from "../../../utilities/interface/forminput/input.active"
import "../../../utilities/prototype/array.prototype"
import ArrayVariables from "../../../utilities/variables/array.variables"
import { libraryCategory } from "../../library/category/category.services"
import { libraryMeasurement } from "../../library/measurement/measurement.services"
import { createMasterlist, fetchMasterlistById, updateMasterlist } from './masterlist.services'

const MasterlistManage = ({ id, name, manage }) => {
    const { setloading } = useClientContext()
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateMasterlist, createMasterlist)
    const [instantiated, setinstantiated] = useState(false)
    const [category, setcategory] = useState()
    const [measurement, setmeasurement] = useState()

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('This is a required field.'),
        details: yup
            .string()
            .required('This is a required field.'),
        sku: yup
            .string()
            .required('This is a required field.'),
        receipt: yup
            .string()
            .required('This is a required field.'),
        category: yup
            .string()
            .required('This is a required field.'),
        unit: yup
            .string()
            .required('This is a required field.'),
        status: yup
            .string()
            .required('This is a required field.'),
    })

    const fields = (errors, register, values, setValue, watch) => {
        return (
            <>
                <Active.Text
                    label="Product Name"
                    register={register}
                    name="name"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-1/2"
                />
                <Active.Text
                    label="Item Description"
                    register={register}
                    name="details"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-1/2"
                />
                <Active.Text
                    label="SKU"
                    register={register}
                    name="sku"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-3/4"
                />
                <Active.Text
                    label="Receipt Name"
                    register={register}
                    name="receipt"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-1/2"
                />
                <Active.Group style="lg:w-1/2">
                    <Active.Select
                        label="Category"
                        register={register}
                        name="category"
                        defaultValue="Hardware"
                        options={category}
                        errors={errors}
                    />
                    <Active.Select
                        label="Unit"
                        register={register}
                        name="unit"
                        options={measurement}
                        errors={errors}
                    />
                </Active.Group>
                <Active.Select
                    label="Item Status"
                    register={register}
                    name="status"
                    defaultValue="A"
                    options={ArrayVariables.statuses}
                    errors={errors}
                    wrapper="lg:w-1/2"
                />
            </>
        )
    }

    useEffect(() => {
        const instantiate = async () => {
            setcategory(await libraryCategory())
            setmeasurement(await libraryMeasurement())
            setinstantiated(true)
        }

        instantiate()
        return () => {
            setinstantiated(false)
        }
    }, [])

    useEffect(() => {
        if (id && instantiated) {
            fetchMasterlistById(id).then((ret) => {
                setvalues({
                    name: ret?.result?.name,
                    details: ret?.result?.details,
                    sku: ret?.result?.sku,
                    receipt: ret?.result?.receipt,
                    category: ret?.result?.category,
                    unit: ret?.result?.unit,
                })
            })
        }
    }, [id, instantiated])

    const submit = (data) => {
        setloading(true)
        let param = {
            name: data.name,
            details: data.details,
            sku: data.sku,
            receipt: data.receipt,
            category: data.category,
            unit: data.unit,
        }
        if (id) param = { ...param, id: id }
        mutate(param)
        setloading(false)
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

export default MasterlistManage