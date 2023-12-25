import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD


export const migrateTransaction = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/transaction/migrate`, data)
    return res.data
}

export const createTransaction = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/transaction`, data)
    return res.data
}

export const updateTransaction = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/transaction`, data)
    return res.data
}

export const fetchTransactionById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/transaction/element`, opt)
    return res.data
}

export const fetchTransactionByShift = async (code, trans) => {
    const opt = { params: { code: code, trans: trans } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/transaction/shift`, opt)
    return res.data
}

export const fetchTransactionByReady = async (shift) => {
    const opt = { params: { shift: shift, status: "READY" } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/transaction/ready`, opt)
    return res.data
}

export const fetchTransactionByLogged = async (datefr, dateto, account, code) => {
    const opt = { params: { datefr: datefr, dateto: dateto, account: account, code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/transaction/logged`, opt)
    return res.data
}

export const fetchTransactionBySlipno = async (account, code) => {
    const opt = { params: { account: account, code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/transaction/slipno`, opt)
    return res.data
}

export const fetchTransactionBySchedule = async (shift) => {
    const opt = { params: { shift: shift } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/transaction/schedule`, opt)
    return res.data
}

export const migrateDispensing = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/dispensing/migrate`, data)
    return res.data
}

export const batchDispensing = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/dispensing/batch`, data)
    return res.data
}

export const fetchDispensingByInventory = async (item) => {
    const opt = { params: { item: item } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/dispensing/inventory`, opt)
    return res.data
}

export const migratePayment = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/payment/migrate`, data)
    return res.data
}

export const updatePayment = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/payment`, data)
    return res.data
}

export const batchPayment = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/payment/batch`, data)
    return res.data
}

export const fetchPaymentByTransaction = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/payment/transaction`, opt)
    return res.data
}

export const returnPayment = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/payment/return`, data)
    return res.data
}

export const createCredits = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/credits`, data)
    return res.data
}

export const updateCredits = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/credits`, data)
    return res.data
}

export const fetchCreditsById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/credits/element`, opt)
    return res.data
}

export const fetchDispensingByTransaction = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/dispensing/transaction`, opt)
    return res.data
}

export const createReturnRequest = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/request`, data)
    return res.data
}

export const fetchRequestByProgress = async (code, status) => {
    const opt = { params: { code: code, status: status } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/request/progress`, opt)
    return res.data
}

export const fetchRequestByTransaction = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/request/transaction`, opt)
    return res.data
}

export const updateDispensing = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/dispensing`, data)
    return res.data
}

export const updateDispensingByRequest = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/dispensing/request`, data)
    return res.data
}

export const fetchTransactionByCode = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/transaction/code`, opt)
    return res.data
}

export const batchReturn = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/returned/batch`, data)
    return res.data
}

export const fetchReturnByInventory = async (item) => {
    const opt = { params: { item: item } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/returned/inventory`, opt)
    return res.data
}

export const fetchReturnByTransaction = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/returned/transaction`, opt)
    return res.data
}

export const createShift = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/schedule`, data)
    return res.data
}

export const updateShift = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/schedule`, data)
    return res.data
}

export const deleteShift = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/custom/cashering/schedule`, opt)
    return res.data
}

export const transferShift = async (data) => {
    const res = await axios.patch(`${BASE_URL}/custom/cashering/schedule/transfer`, data)
    return res.data
}

export const fetchShiftByStart = async (id, date) => {
    const opt = { params: { id: id, date: date } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/schedule/start`, opt)
    return res.data
}

export const fetchShiftByAccount = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/schedule/account`, opt)
    return res.data
}

export const createRemittance = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/remittance`, data)
    return res.data
}

export const createCollection = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/collection`, data)
    return res.data
}

export const createReimbursement = async (data) => {
    const res = await axios.post(`${BASE_URL}/custom/cashering/reimburse`, data)
    return res.data
}

export const fetchReimbursementByTransaction = async (code) => {
    const opt = { params: { code: code } }
    const res = await axios.get(`${BASE_URL}/custom/cashering/reimburse/transaction`, opt)
    return res.data
}

// export const fetchCashering = async (search = '') => {
//     const opt = { params: { search: search } }
//     const res = await axios.get(`${BASE_URL}/feature/cashering`, opt)
//     return res.data
// }

// export const createCashering = async (data) => {
//     const res = await axios.post(`${BASE_URL}/feature/cashering`, data)
//     return res.data
// }

// export const updateCashering = async (data) => {
//     const res = await axios.patch(`${BASE_URL}/feature/cashering`, data)
//     return res.data
// }

// export const deleteCashering = async (id) => {
//     const opt = { data: { id: id } }
//     const res = await axios.delete(`${BASE_URL}/feature/cashering`, opt)
//     return res.data
// }

// export const searchCashering = async (search) => {
//     const opt = { params: { search: search } }
//     const res = await axios.get(`${BASE_URL}/feature/cashering/search`, opt)
//     return res.data
// }

// export const fetchCasheringById = async (id) => {
//     const opt = { params: { id: id } }
//     const res = await axios.get(`${BASE_URL}/feature/cashering/element`, opt)
//     return res.data
// }