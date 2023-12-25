const reimburse = {
    name: 'pos_return_reimbursement',
    fields: {
        id: 'reim_id',
        code: 'reim_trans',
        time: 'reim_time',
        request: 'reim_request',
        method: 'reim_method',
        amount: 'reim_amount',
        reference: 'reim_refcode',
        account: 'reim_account',
        shift: 'reim_shift',
    }
}

module.exports = {
    reimburse
}