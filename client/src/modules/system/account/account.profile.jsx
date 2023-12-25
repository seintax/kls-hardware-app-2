import { EyeIcon } from "@heroicons/react/24/solid"
import bcrypt from "bcryptjs-react"
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { encryptToken } from "../../../utilities/functions/string.functions"
import { fetchAccountById, updateAccount } from "./account.services"

const AccountProfile = () => {
    const { handleNotification } = useNotificationContext()
    const { handleTrail } = useClientContext()
    const location = useLocation()
    const { user } = useClientContext()
    const [info, setinfo] = useState()
    const [name, setname] = useState("")
    const [view, setview] = useState({
        current: "password",
        new: "password",
        confirm: "password"
    })
    const [pass, setpass] = useState({
        current: "",
        new: "",
        confirm: ""
    })

    useEffect(() => {
        if (user) {
            const instantiate = async () => {
                setname(user.name)
                let res = await fetchAccountById(user.id)
                setinfo(res.result)
            }

            instantiate()
        }
    }, [user])


    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    const onMouseDown = (e, name, type) => {
        setview(prev => ({
            ...prev,
            [name]: type
        }))
    }

    const onChange = (e) => {
        const { value } = e.target
        setname(value)
    }

    const onPassChange = (e) => {
        const { name, value } = e.target
        setpass(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onMouseUp = (e, name, type) => {
        setview(prev => ({
            ...prev,
            [name]: type
        }))
    }

    const onMouseLeave = (e, name, type) => {
        setview(prev => ({
            ...prev,
            [name]: type
        }))
    }

    const applyChanges = async () => {
        if (name && name !== user.name) {
            let resAcc = await updateAccount({
                name: name,
                id: user.id
            })
            if (!resAcc.success) {
                handleNotification({
                    type: 'error',
                    message: "Error occured while updating your account information.",
                })
                return
            }
            let token = JSON.stringify({
                id: user.id,
                name: name,
                token: user.token
            })
            localStorage.setItem("cred", token)
        }
        if (pass.current && pass.new && pass.confirm) {
            let hashcurr = bcrypt.hashSync(`${info?.user}-${pass.current}`, '$2a$10$tSnuDwpZctfa5AvyRzczJu')
            if (hashcurr !== info.pass) {
                handleNotification({
                    type: 'error',
                    message: "Password is incorrect.",
                })
                return
            }
            if (pass.new.length < 6) {
                handleNotification({
                    type: 'error',
                    message: "Password strength is invalid.",
                })
                return
            }
            if (pass.new !== pass.confirm) {
                handleNotification({
                    type: 'error',
                    message: "Password is mismatch.",
                })
                return
            }
            let hashpass = encryptToken(bcrypt.hashSync(`${info?.user}-${pass.new}`, '$2a$10$tSnuDwpZctfa5AvyRzczJu'))
            let resPass = await updateAccount({
                pass: hashpass,
                id: user.id
            })
            if (!resPass.success) {
                handleNotification({
                    type: 'error',
                    message: "Error occured while updating your password.",
                })
                return
            }
        }
        setpass({
            current: "",
            new: "",
            confirm: ""
        })
        handleNotification({
            type: 'success',
            message: "Changes has been applied.",
        })
    }

    return (
        <div className='flex flex-col px-4 py-5 sm:px-6 lg:px-8 h-full gap-[40px]'>
            <div className="font-bold text-xl">My Profile</div>
            <div className="flex flex-col gap-[20px] text-lg">
                <div className="flex items-end">
                    <div className="w-[200px] text-[#7c7b7b]">Username:</div>
                    <div className="font-medium pl-3">{info?.user}</div>
                </div>
                <div className="flex items-end">
                    <div className="w-[200px] text-[#7c7b7b]">Fullname:</div>
                    <div className="font-medium">
                        <input
                            type="text"
                            className="w-[350px] border-white border-b border-b-[#000000] focus:ring-0 focus:outline-none focus:ring-gray-400 focus:border-white focus:border-b focus:border-b-[#000000] font-medium uppercase"
                            placeholder="Provide your fullname here"
                            value={name}
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className="mt-[100px]">
                    Change your password?
                </div>
                <div className="text-sm italic">
                    Note: Password must have atleast 6 characters with a symbol, an uppercase letter and a number.
                </div>
                <div className="flex items-end">
                    <div className="w-[200px] text-[#7c7b7b]">Current Password:</div>
                    <div className="flex relative font-medium">
                        <input
                            type={view.current}
                            name="current"
                            className="w-[350px] border-white border-b border-b-[#000000] focus:ring-0 focus:outline-none focus:ring-gray-400 focus:border-white focus:border-b focus:border-b-[#000000] font-medium uppercase"
                            placeholder="Your current password"
                            value={pass.current}
                            onChange={onPassChange}
                        />
                        <div className="absolute right-0 mr-1 cursor-pointer p-2" onMouseDown={(e) => onMouseDown(e, "current", "text")} onMouseUp={(e) => onMouseUp(e, "current", "password")} onMouseLeave={(e) => onMouseLeave(e, "current", "password")}>
                            <EyeIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div className="flex items-end">
                    <div className="w-[200px] text-[#7c7b7b]">New Password:</div>
                    <div className="flex relative font-medium">
                        <input
                            type={view.new}
                            name="new"
                            className="w-[350px] border-white border-b border-b-[#000000] focus:ring-0 focus:outline-none focus:ring-gray-400 focus:border-white focus:border-b focus:border-b-[#000000] font-medium uppercase"
                            placeholder="Your New password"
                            value={pass.new}
                            onChange={onPassChange}
                        />
                        <div className="absolute right-0 mr-1 cursor-pointer p-2" onMouseDown={(e) => onMouseDown(e, "new", "text")} onMouseUp={(e) => onMouseUp(e, "new", "password")} onMouseLeave={(e) => onMouseLeave(e, "new", "password")}>
                            <EyeIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div className="flex items-end">
                    <div className="w-[200px] text-[#7c7b7b]">Confirm Password:</div>
                    <div className="flex relative font-medium">
                        <input
                            type={view.confirm}
                            name="confirm"
                            className="w-[350px] border-white border-b border-b-[#000000] focus:ring-0 focus:outline-none focus:ring-gray-400 focus:border-white focus:border-b focus:border-b-[#000000] font-medium uppercase"
                            placeholder="Confirm your password"
                            value={pass.confirm}
                            onChange={onPassChange}
                        />
                        <div className="absolute right-0 mr-1 cursor-pointer p-2" onMouseDown={(e) => onMouseDown(e, "confirm", "text")} onMouseUp={(e) => onMouseUp(e, "confirm", "password")} onMouseLeave={(e) => onMouseLeave(e, "confirm", "password")}>
                            <EyeIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-start w-full mt-[100px]">
                    <button className="button-blue py-4 px-10" onClick={() => applyChanges()}>
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccountProfile