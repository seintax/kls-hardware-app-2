import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import AppLoading from "../interface/application/errormgmt/app.loading"

const ClientContext = createContext()

export function useClientContext() {
    return useContext(ClientContext)
}

export default function ClientProvider({ children }) {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [trail, setTrail] = useState([])
    const [config, setConfig] = useState({})
    const [cache, setcache] = useState({
        schedule: []
    })
    const [search, setSearch] = useState({
        time: new Date(),
        key: "",
        all: {
            inventory: "N",
            conversion: "N"
        }
    })
    const [selected, setSelected] = useState({})
    const [print, setPrint] = useState([])
    const [user, setuser] = useState()

    function handleTrail(pathname) {
        let path = pathname.split("/").filter(path => path !== "")
        setTrail(path.map((p, i) => {
            if (p) {
                return {
                    name: p.toProperCase(),
                    href: `/${p}`,
                    current: (path.length - 1) === i
                }
            }
        }) || [])
    }

    const handleLoading = async (callback) => {
        setloading(true)
        await callback()
        setloading(false)
    }

    const renderSelected = (fallback, key) => {
        if (!key) {
            navigate(fallback)
            return
        }
        return key
    }

    const clearSearchKey = () => {
        setSearch(prev => ({
            ...prev,
            key: ""
        }))
    }

    return (
        <ClientContext.Provider value={{
            trail,
            handleTrail,
            config,
            setConfig,
            search,
            setSearch,
            selected,
            setSelected,
            clearSearchKey,
            cache,
            setcache,
            user,
            setuser,
            print,
            setPrint,
            loading,
            setloading,
            handleLoading,
            renderSelected
        }}>
            {children}
            <AppLoading loading={loading} />
        </ClientContext.Provider>
    )
}
