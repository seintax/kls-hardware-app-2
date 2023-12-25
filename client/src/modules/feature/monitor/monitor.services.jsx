import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const fetchPaymentByCheque = async () => {
    const opt = { params: { test: "" } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/payment/cheque`, opt)
    return res.data
}