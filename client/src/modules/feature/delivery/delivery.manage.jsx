import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Active from "../../../utilities/interface/forminput/input.active"
import { librarySupplier } from "../supplier/supplier.services"
import { createDelivery, fetchDeliveryById, updateDelivery } from './delivery.services'

const DeliveryManage = ({ id, name, manage }) => {
    const location = useLocation()
    const { selected } = useClientContext()
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateDelivery, createDelivery)
    const [instantiated, setinstantiated] = useState(false)
    const [supplier, setsupplier] = useState()

    const schema = yup.object().shape({
        supplier: yup
            .string()
            .required('This is a required field.'),
        drno: yup
            .string()
            .required('This is a required field.'),
        date: yup
            .date()
            .required('This is a required field.'),
    })

    const fields = (errors, register, values, setValue, watch) => {
        return (
            <>
                <Active.Select
                    label="Supplier"
                    register={register}
                    name="supplier"
                    options={supplier}
                    errors={errors}
                    defaultValue={1}
                    wrapper="lg:w-1/2"
                />
                <Active.Group style="lg:w-1/2">
                    <Active.Text
                        label="DR No."
                        register={register}
                        name="drno"
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Date
                        label="Date Delivered"
                        register={register}
                        name="date"
                        errors={errors}
                        autoComplete="off"
                        defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                    />
                </Active.Group>
                <Active.Text
                    label="Remarks"
                    register={register}
                    name="remarks"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-3/4"
                />
            </>
        )
    }

    useEffect(() => {
        const instantiate = async () => {
            setsupplier(await librarySupplier())
            setinstantiated(true)
        }

        instantiate()
        return () => {
            setinstantiated(false)
        }
    }, [])

    useEffect(() => {
        if (id && instantiated) {
            fetchDeliveryById(id).then((ret) => {
                setvalues({
                    supplier: ret?.result?.supplier,
                    drno: ret?.result?.drno,
                    date: moment(ret?.result?.date).format("YYYY-MM-DD"),
                    remarks: ret?.result?.remarks,
                })
            })
        }
        if (!id && instantiated) {
            setvalues({
                supplier: location.pathname.includes("suppliers") ? selected?.supplier?.id : "",
                drno: "",
                date: moment(new Date()).format("YYYY-MM-DD"),
                remarks: "",
            })
        }
    }, [id, instantiated])

    const submit = (data) => {
        let param = {
            supplier: data.supplier,
            drno: data.drno,
            date: moment(data.date).format("YYYY-MM-DD"),
            remarks: data.remarks,
        }
        if (id) param = { ...param, id: id }
        mutate(param)
        manage(false)
    }

    return (
        <DataInputs
            id={id}
            name={location.pathname.includes("suppliers") ? "Delivery" : name}
            values={values}
            schema={schema}
            fields={fields}
            submit={submit}
            manage={manage}
        />
    )
}

export default DeliveryManage