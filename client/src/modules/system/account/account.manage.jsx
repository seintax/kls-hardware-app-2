import bcrypt from "bcryptjs-react"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { processForm } from '../../../utilities/functions/query.functions'
import { encryptToken } from "../../../utilities/functions/string.functions"
import useYup from '../../../utilities/hooks/useYup'
import DataInputs from '../../../utilities/interface/datastack/data.inputs'
import Active from "../../../utilities/interface/forminput/input.active"
import { createAccount, fetchAccountById, updateAccount } from './account.services'

const AccountManage = ({ id, name, manage }) => {
    const [values, setvalues] = useState()
    const { yup } = useYup()
    const { mutate } = processForm(id, name, updateAccount, createAccount)
    const [instantiated, setinstantiated] = useState(false)

    const schema = yup.object().shape({
        user: yup
            .string()
            .required('Please enter your username.'),
        pass: yup
            .string()
            .required('Please enter your password.')
            .matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 characters, one uppercase, one number and one special case character"),
        confirm: yup
            .string()
            .min(8)
            .required('Please confirm your password.')
            .oneOf([yup.ref('pass'), null], "Passwords do not match."),
    })

    const fields = (errors, register, values, setValue, watch) => {
        return (
            <>
                <Active.Text
                    label='Username'
                    register={register}
                    name='user'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/4'
                    style='uppercase'
                />
                <Active.Group style="lg:w-1/2">
                    <Active.Password
                        label='Password'
                        register={register}
                        name='pass'
                        errors={errors}
                        autoComplete='off'
                    />
                    <Active.Password
                        label='Confirm Password'
                        register={register}
                        name='confirm'
                        errors={errors}
                        autoComplete='off'
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
            fetchAccountById(id).then((ret) => {
                setvalues({
                    user: ret?.result?.user.toUpperCase(),
                    pass: "",
                    confirm: ""
                })
            })
        }
    }, [id, instantiated])

    const submit = (data) => {
        const hash = bcrypt.hashSync(`${data.user}-${data.pass}`, '$2a$10$tSnuDwpZctfa5AvyRzczJu')
        let param = {
            user: data.user,
            pass: encryptToken(hash),
        }
        if (id) param = { ...param, id: id }
        if (!id) param = { ...param, name: `User${moment(new Date()).format("YYYYMMDDHHmmss")}` }
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

export default AccountManage