import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchMeasurement = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/library/measurement`, opt)
    return res.data
}

export const createMeasurement = async (data) => {
    const res = await axios.post(`${BASE_URL}/library/measurement`, data)
    return res.data
}

export const updateMeasurement = async (data) => {
    const res = await axios.patch(`${BASE_URL}/library/measurement`, data)
    return res.data
}

export const deleteMeasurement = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/library/measurement`, opt)
    return res.data
}

export const fetchMeasurementById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/library/measurement/element`, opt)
    return res.data
}

export const libraryMeasurement = async () => {
    const res = await fetchMeasurement()
    let value = res?.result?.map(data => {
        return { value: data.display, key: `${data.name} ${data.display}`, data: data }
    }) || []
    return value
}