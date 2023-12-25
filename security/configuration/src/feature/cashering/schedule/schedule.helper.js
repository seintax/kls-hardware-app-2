const schedule = {
    name: 'pos_shift_schedule',
    fields: {
        id: 'shft_id',
        account: 'shft_account',
        begshift: 'shft_start',
        begcash: 'shft_beg_cash',
        status: 'shft_status',
        endshift: 'shft_close',
        endcash: 'shft_end_cash',
        totalhrs: 'shft_total_hrs',
    },
    balanceUpdate: 'UPDATE pos_shift_schedule SET shft_end_cash=(shft_beg_cash + (SELECT SUM(paym_amount) FROM pos_payment_collection WHERE paym_shift=shft_id)) WHERE shft_id=?'
}

module.exports = {
    schedule
}