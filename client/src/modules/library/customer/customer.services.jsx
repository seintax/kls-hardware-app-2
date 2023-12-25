import axios from 'axios'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchCustomer = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/customer`, opt)
    return res.data
}

export const createCustomer = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/customer`, data)
    return res.data
}

export const updateCustomer = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/customer`, data)
    return res.data
}

export const deleteCustomer = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/custom/cashering/customer`, opt)
    return res.data
}

export const searchCustomer = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/customer/search`, opt)
    return res.data
}

export const fetchCustomerById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/customer/element`, opt)
    return res.data
}

export const libraryCustomer = async () => {
    const res = await fetchCustomer()
    let value = res?.result?.map(data => {
        return { value: data.id, key: `${data.name} ${data.value == 0 ? "" : `(${currencyFormat.format(data.value)} Credit Value)`}`, data: data }
    }) || []
    return value
}

export const balanceCustomer = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/customer/balance`, data)
    return res.data
}