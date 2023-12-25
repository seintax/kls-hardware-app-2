const remittance = {
    name: 'pos_shift_remittance',
    fields: {
        id: 'rmtt_id',
        account: 'rmtt_account',
        shift: 'rmtt_shift',
        time: 'rmtt_time',
        amount: 'rmtt_amount',
        collection: 'rmtt_collection',
        reviewedby: 'rmtt_reviewedby',
        approvedby: 'rmtt_approvedby',
    }
}

module.exports = {
    remittance
}