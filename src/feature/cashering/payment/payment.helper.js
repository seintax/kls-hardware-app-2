const payment = {
    name: 'pos_payment_collection',
    fields: {
        id: 'paym_id',
        code: 'paym_trans',
        time: 'paym_time',
        type: 'paym_type',
        method: 'paym_method',
        amount: 'paym_amount',
        refcode: 'paym_refcode',
        refdate: 'paym_refdate',
        refstat: 'paym_refstat',
        reimburse: 'paym_reimburse',
        shift: 'paym_shift',
    },
    joined: {
        start: 'shft_start',
    },
    conditional: "LEFT JOIN pos_shift_schedule ON shft_id=paym_shift"
}

module.exports = {
    payment
}