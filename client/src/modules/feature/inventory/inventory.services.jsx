import axios from 'axios'
import { currencyFormat } from "../../../utilities/functions/number.funtions"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchInventory = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/inventory`, opt)
    return res.data
}

export const createInventory = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/inventory`, data)
    return res.data
}

export const updateInventory = async (data) => {
    const res = await axios.patch(`${BASE_URL}/feature/inventory`, data)
    return res.data
}

export const deleteInventory = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/feature/inventory`, opt)
    return res.data
}

export const searchInventory = async (search, all) => {
    const opt = { params: { search: search, all: all } }
    const res = await axios.get(`${BASE_URL}/feature/inventory/search`, opt)
    return res.data
}

export const fetchInventoryByAvailability = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/inventory/available`, opt)
    return res.data
}

export const fetchInventoryByLibrary = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/inventory/library`, opt)
    return res.data
}

export const fetchInventoryById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/inventory/element`, opt)
    return res.data
}

export const deliveryInventoryByRef = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/feature/inventory/delivery`, opt)
    return res.data
}

export const transferInventory = async (id, qty, op) => {
    const opt = { id: id, qty: qty, op: op }
    const res = await axios.patch(`${BASE_URL}/feature/inventory/transfer`, opt)
    return res.data
}

export const libraryInventory = async () => {
    const res = await fetchInventoryByLibrary()
    let value = res?.result?.map(data => {
        return { value: data.id, key: `${data.name} ${data.details} ${data.unit} - DRNO:${data.drno} REM:${data.stocks} RCV:${data.received} PRC:${currencyFormat.format(data.price)}`, data: data }
    }) || []
    return value
}

export const batchInventory = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/inventory/batch`, data)
    return res.data
}

export const returnInventory = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/inventory/return`, data)
    return res.data
}

export const convertInventory = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/inventory/convert`, data)
    return res.data
}

export const balanceInventory = async () => {
    const res = await axios.post(`${BASE_URL}/feature/inventory/balance`)
    return res.data
}

export const stocksInventory = async (id) => {
    const data = { id: id }
    const res = await axios.post(`${BASE_URL}/feature/inventory/stocks`, data)
    return res.data
}

export const createInventoryPrice = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/prices`, data)
    return res.data
}

export const fetchConversionByAvailability = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/feature/conversion/available`, opt)
    return res.data
}

export const fetchConversionByInventory = async (item) => {
    const opt = { params: { item: item } }
    const res = await axios.get(`${BASE_URL}/feature/conversion/inventory`, opt)
    return res.data
}

export const batchConversion = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/conversion/batch`, data)
    return res.data
}

export const returnConversion = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/conversion/return`, data)
    return res.data
}

export const createConversion = async (data) => {
    const res = await axios.post(`${BASE_URL}/feature/conversion`, data)
    return res.data
}

export const searchConversion = async (search, all) => {
    const opt = { params: { search: search, all: all } }
    const res = await axios.get(`${BASE_URL}/feature/conversion/search`, opt)
    return res.data
}

