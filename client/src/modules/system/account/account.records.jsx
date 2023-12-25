import { LockClosedIcon } from "@heroicons/react/20/solid"
import bcrypt from "bcryptjs-react"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { encryptToken } from "../../../utilities/functions/string.functions"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import NotificationDelete from '../../../utilities/interface/notification/notification.delete'
import { fetchShiftByStart } from "../../feature/cashering/cashering.service"
import { deleteAccount, loginAccount, loginAsAccount } from './account.services'

const AccountRecords = ({ setter, manage, refetch, data }) => {
    const { user } = useClientContext()
    const navigate = useNavigate()
    const { handleNotification } = useNotificationContext()
    const [records, setrecords] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [currentRecord, setCurrentRecord] = useState({})
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Username', stack: true, sort: 'user' },
            { name: 'Fullname', stack: false, sort: 'name', size: 350 },
            { name: 'Duration', stack: true, sort: 'time', size: 300 },
            { name: '', stack: true, size: 170 },
            { name: '', stack: false, screenreader: 'Action', size: 150 },
        ]
    }

    const rowSelect = (record) => setCurrentRecord(record)

    const toggleDelete = (record) => {
        setCurrentRecord(record)
        setShowDelete(true)
    }

    const toggleEdit = (item) => {
        setter(item.id)
        manage(true)
    }

    const handleDelete = async () => {
        if (currentRecord) {
            let res = await deleteAccount(currentRecord?.id)
            setShowDelete(false)
            if (res.success) refetch()
        }
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit', hidden: user.name !== "DEVELOPER" && user.name !== "SYSTEM ADMINISTRATOR" },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete', hidden: user.name !== "DEVELOPER" && user.name !== "SYSTEM ADMINISTRATOR" }
        ]
    }

    const checkForShift = async (id) => {
        if (id) {
            let res = await fetchShiftByStart(id)
            if (res?.result?.id) {
                localStorage.setItem("shift", JSON.stringify({
                    shift: res?.result?.id,
                    status: res?.result?.status,
                    begcash: res?.result?.begcash,
                    begshift: res?.result?.begshift
                }))
            }
            else localStorage.removeItem("shift")
        }
        else localStorage.removeItem("shift")
    }

    const login = async (item) => {
        let param = {
            user: item.user,
            pass: encryptToken(bcrypt.hashSync(`${item.user}-${item.pass}`, '$2a$10$tSnuDwpZctfa5AvyRzczJu')),
            token: encryptToken(bcrypt.hashSync(`${item.user}-${item.pass}-${moment(new Date()).format("MM-DD-YYYY HH:mm:ss")}`, '$2a$10$1pPiefI.K4fOTeXVRdLkNO')),
        }
        let res = await loginAccount(param.user, param.pass, param.token)
        if (res?.result?.name) {
            let id = res?.result?.id
            let token = JSON.stringify(res?.result)
            localStorage.setItem("cred", token)
            await checkForShift(id)
            window.location.reload(false)
            return
        }
        handleNotification({
            type: 'error',
            message: "Invalid credentials. Please try again."
        })
        window.location.reload(false)
    }

    const loginAs = async (item) => {
        if (!item.pass) {
            handleNotification({
                type: 'error',
                message: "Password cannot be processed."
            })
            return
        }
        if (window.confirm(`Do you want to login as ${item.user}/${item.name}?`)) {
            let param = {
                user: item.user,
                pass: encryptToken(item.pass),
            }
            let res = await loginAsAccount(param.user, param.pass, param.token)
            if (res?.result?.name) {
                let id = res?.result?.id
                let token = JSON.stringify(res?.result)
                localStorage.setItem("cred", token)
                await checkForShift(id)
                window.location.reload(false)
                return
            }
            handleNotification({
                type: 'error',
                message: "Invalid credentials. Please try again."
            })
        }
    }

    const items = (item) => {
        return [
            { value: item.user },
            { value: item.name || <span className="italic">Unnamed</span> },
            { value: item.time ? moment(item.time).format("MM-DD-YYYY HH:mm:ss") : "" },
            {
                value: <div className={`w-fit flex gap-1 items-center ${user.name !== "DEVELOPER" ? "hidden" : ""}`}>
                    <span className={`px-3 py-0.5 rounded-md text-white cursor-pointer ${item.token ? "bg-primary-600 hover:bg-primary-700" : "bg-gray-600 hover:bg-gray-700"} ${item.name === "DEVELOPER" ? "hidden" : ""}`}>Login as</span>
                    <LockClosedIcon className={`w-4 h-4 ${item.pass ? "hidden" : ""}`} />
                </div>,
                onclick: () => user.name === "DEVELOPER" && item.name !== "DEVELOPER" ? (!item.token ? login(item) : loginAs(item)) : {},
                position: "text-center"
            },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    ondoubleclick: () => rowSelect(item),
                    items: items(item)
                }
            }))
        }
    }, [data, sorted])

    return (
        <>
            <DataRecords
                columns={columns}
                records={records}
                page={startpage}
                setPage={setstartpage}
                itemsperpage={itemsperpage}
                setsorted={setsorted}
            />
            <NotificationDelete
                name={currentRecord?.supplier}
                show={showDelete}
                setshow={setShowDelete}
                handleDelete={handleDelete}
            />
        </>
    )
}
export default AccountRecords