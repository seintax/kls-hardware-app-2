import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { Link, useLocation } from "react-router-dom"
import SpinnerIcon from "../../../assets/SpinnerIcon"
import { useClientContext } from "../../context/client.context"

const DataInputs = ({ id, name, fields, schema, submit, values, manage, option }) => {
    const location = useLocation()
    const { handleTrail } = useClientContext()
    const isEdit = !!id
    const {
        register,
        setValue,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: values,
    })

    useEffect(() => {
        if (!id) reset()
    }, [])

    useEffect(() => {
        handleTrail(location.pathname.split("/").filter(fvar => fvar !== id).join("/"))
    }, [location])

    useEffect(() => {
        if (values) for (const prop in values) setValue(prop, values[prop])
    }, [values])

    const doSubmit = (data) => {
        submit(data)
        reset()
    }

    // function prevLocation() {
    //     return location.pathname.split("/").filter(fvar => fvar !== id).slice(0, -1).join("/")
    // }

    const toggleLinkCancel = () => {
        manage(false)
        reset()
    }

    const toggleButtonCancel = () => {
        option?.setshow()
        reset()
    }

    const preventSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className={option?.modal ? "py-2 px-2" : "py-6 px-4 sm:px-6 lg:px-8"}>
            <div className={option?.modal ? "" : "px-4 py-5 sm:p-6 shadow bg-white rounded"}>
                <form
                    onSubmit={submit ? handleSubmit(doSubmit) : preventSubmit}
                    className="space-y-8"
                >
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 sm:space-y-5">
                            <div className="flex items-center justify-between pb-5">
                                <div className={option?.modal ? "hidden" : "text-lg font-medium leading-6 text-[#010a3a] uppercase"}>
                                    {isEdit ? `Edit ${name}` : `Add ${name}`}
                                </div>
                            </div>

                            {fields(errors, register, values, setValue, watch, reset)}

                        </div>
                    </div>
                    <div className={submit ? "" : "hidden"}>
                        <div className="mt-10 flex justify-end">
                            <Link
                                onClick={() => toggleLinkCancel()}
                                type="button"
                                className={option?.modal ? "hidden" : "button-cancel"}
                            >
                                Cancel
                            </Link>
                            <button
                                type="button"
                                className={option?.modal ? "button-cancel" : "hidden"}
                                onClick={() => toggleButtonCancel()}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`button-submit`}
                            >
                                {isSubmitting && <SpinnerIcon />}
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DataInputs