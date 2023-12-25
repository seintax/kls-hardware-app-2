import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchDelivery = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/delivery`, opt)
    return res.data
}

export const createDelivery = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/delivery`, data)
    return res.data
}

export const updateDelivery = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/delivery`, data)
    return res.data
}

export const deleteDelivery = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/feature/delivery`, opt)
    return res.data
}

export const searchDelivery = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/delivery/search`, opt)
    return res.data
}

export const fetchDeliveryById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/delivery/element`, opt)
    return res.data
}

export const balanceDelivery = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/delivery/balance`, data)
    return res.data
}

export const fetchDeliveryBySupplier = async (supplier) => {
    const opt = { params: { supplier: supplier } }
    const res = await axios.get(`${BASE_URL}/feature/delivery/supplier`, opt)
    return res.data
}