import moment from "moment"
import React, { useEffect, useState } from 'react'
import { processForm } from '../../../utilities/functions/query.functions'
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import Active from "../../../utilities/interface/forminput/input.active"
import { createTransfer, fetchTransferById, updateTransfer } from './transfer.services'

const TransferManage = ({ id, name, manage }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateTransfer, createTransfer)
    const [instantiated, setinstantiated] = useState(false)

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('This is a required field.'),
        trno: yup
            .string()
            .required('This is a required field.'),
        date: yup
            .date()
            .required('This is a required field.'),
    })

    const fields = (errors, register, values, setValue, watch) => {
        return (
            <>
                <Active.Text
                    label="Transfer Destination"
                    register={register}
                    name="name"
                    errors={errors}
                    autoComplete="off"
                    wrapper="lg:w-1/2"
                />
                <Active.Group style="lg:w-1/2">
                    <Active.Text
                        label="TR No."
                        register={register}
                        name="trno"
                        errors={errors}
                        autoComplete="off"
                    />
                    <Active.Date
                        label="Date Transfered"
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
            setinstantiated(true)
        }

        instantiate()
        return () => {
            setinstantiated(false)
        }
    }, [])

    useEffect(() => {
        if (id && instantiated) {
            fetchTransferById(id).then((ret) => {
                setvalues({
                    name: ret?.result?.name,
                    trno: ret?.result?.trno,
                    date: moment(ret?.result?.date).format("YYYY-MM-DD"),
                    remarks: ret?.result?.remarks,
                })
            })
        }
    }, [id, instantiated])

    const submit = (data) => {
        let param = {
            name: data.name,
            trno: data.trno,
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
            name={name}
            values={values}
            schema={schema}
            fields={fields}
            submit={submit}
            manage={manage}
        />
    )
}

export default TransferManage