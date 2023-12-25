import { EyeIcon } from "@heroicons/react/20/solid"
import bcrypt from "bcryptjs-react"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import DevLogo from "../../../assets/logo.ico"
import { useClientContext } from "../../../utilities/context/client.context"
import { encryptToken } from "../../../utilities/functions/string.functions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import { fetchShiftByStart } from "../../feature/cashering/cashering.service"
import { loginAccount } from "./account.services"

const AccountLogin = () => {
    const navigate = useNavigate()
    const { setuser } = useClientContext()
    const [error, seterror] = useState("")
    const [view, setview] = useState("password")
    const [login, setlogin] = useState({
        user: "",
        pass: ""
    })

    useEffect(() => {
        localStorage.removeItem("cred")
        localStorage.removeItem("shift")
    }, [])


    const onChange = (e) => {
        const { name, value } = e.target
        setlogin(prev => ({ ...prev, [name]: value }))
        seterror("")
    }

    const checkForShift = async (id) => {
        if (id) {
            let res = await fetchShiftByStart(id)
            if (res?.result?.id) {
                let userInfo = {
                    shift: res?.result?.id,
                    status: res?.result?.status,
                    begcash: res?.result?.begcash,
                    begshift: res?.result?.begshift
                }
                setuser(userInfo)
                localStorage.setItem("shift", JSON.stringify(userInfo))
            }
            else localStorage.removeItem("shift")
        }
        else localStorage.removeItem("shift")
    }

    const onLogin = async (e) => {
        e.preventDefault()
        let loguser = login.user.toUpperCase()
        let param = {
            user: loguser,
            pass: encryptToken(bcrypt.hashSync(`${loguser}-${login.pass}`, '$2a$10$tSnuDwpZctfa5AvyRzczJu')),
            token: encryptToken(bcrypt.hashSync(`${loguser}-${login.pass}-${moment(new Date()).format("MM-DD-YYYY HH:mm:ss")}`, '$2a$10$1pPiefI.K4fOTeXVRdLkNO'))
        }
        let res = await loginAccount(param.user, param.pass, param.token)
        if (res?.result?.name) {
            let id = res?.result?.id
            let token = JSON.stringify(res?.result)
            localStorage.setItem("cred", token)
            await checkForShift(id)
            navigate("/dashboard")
            return
        }
        seterror("Invalid credentials. Please try again.")
    }

    return (
        <div className="flex min-h-full flex-col justify-center py-12 bg-gradient-to-r from-[#010a3a] via-[#182c9c] to-[#010a3a] sm:px-6 lg:px-8 no-select">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <AppLogo style="h-[8rem]" inverted={true} />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-200">
                    Sign in to your account
                </h2>
                <p className="mt-8 text-center text-md text-secondary-400">
                    Login to your all-around <b className="text-secondary-300">Point-of-Sale</b> system for <br /> Hardware Merchandise Services
                </p>
            </div>
            <div className="text-center text-red-500 max-w-md w-full rounded-[20px] mx-auto mt-5">
                {error ? error : ""}
            </div>
            <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={onLogin} className="space-y-6">
                        <div>
                            <div className="mt-1">
                                <input
                                    id="user"
                                    name="user"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Username"
                                    value={login.user}
                                    required
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm uppercase placeholder:normal-case"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mt-1 flex relative items-center">
                                <input
                                    id="pass"
                                    name="pass"
                                    type={view}
                                    autoComplete="off"
                                    placeholder="Password"
                                    value={login.pass}
                                    required
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                />
                                <div className="absolute right-0 mr-1 cursor-pointer p-2" onMouseDown={() => setview("text")} onMouseUp={() => setview("password")} onMouseLeave={() => setview("password")}>
                                    <EyeIcon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-200 hover:underline"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-primary-500 hover:text-primary-400 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex justify-center p-5 text-center text-gray-400 items-center">
                    In partnership with: <img src={DevLogo} className="h-10 w-10 ml-3" /> <span className="text-blue-300 rounded-[10px] hover:underline cursor-pointer flex items-center">KL Info. Tech Services</span>
                </div>
            </div>
        </div>
    )
}

export default AccountLogin