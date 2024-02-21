import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchTransfer = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/transfer`, opt)
    return res.data
}

export const createTransfer = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/transfer`, data)
    return res.data
}

export const updateTransfer = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/transfer`, data)
    return res.data
}

export const deleteTransfer = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/feature/transfer`, opt)
    return res.data
}

export const searchTransfer = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/transfer/search`, opt)
    return res.data
}

export const fetchTransferById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/transfer/element`, opt)
    return res.data
}

export const balanceTransfer = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/transfer/balance`, data)
    return res.data
}

export const createTransported = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/transported`, data)
    return res.data
}

export const updateTransported = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/transported`, data)
    return res.data
}

export const deleteTransported = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/feature/transported`, opt)
    return res.data
}

export const searchTransported = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/transported/search`, opt)
    return res.data
}

export const fetchTransportedById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/transported/element`, opt)
    return res.data
}

export const transferTransportedByRef = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/transported/transfer`, opt)
    return res.data
}

export const fetchTransportedByInventory = async (item) => {
    const opt = { params: { item: item } }
    const res = await axios.get(`${BASE_URL}/feature/transported/inventory`, opt)
    return res.data
}

export const fetchTransportedByProduct = async (product) => {
    const opt = { params: { product: product } }
    const res = await axios.get(`${BASE_URL}/feature/transported/product`, opt)
    return res.data
}