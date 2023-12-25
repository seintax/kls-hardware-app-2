import React, { useEffect, useState } from 'react'
import { useQuery } from "react-query"
import { useClientContext } from "../../../utilities/context/client.context"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import AccountManage from "./account.manage"
import AccountRecords from "./account.records"
import { searchAccount } from "./account.services"

const AccountIndex = () => {
    const { search, user } = useClientContext()
    const name = 'Account'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => searchAccount(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => { refetch() }, [search])

    return (
        (manage) ? (
            <AccountManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                setter={user?.name === "DEVELOPER" || user?.name === "SYSTEM ADMINISTRATOR" ? setId : undefined}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <AccountRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default AccountIndex