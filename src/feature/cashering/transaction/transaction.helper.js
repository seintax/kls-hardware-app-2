const transaction = {
    name: 'pos_sales_transaction',
    fields: {
        id: 'trns_id',
        code: 'trns_code',
        ordno: 'trns_order',
        time: 'trns_time',
        vat: 'trns_vat',
        total: 'trns_total',
        less: 'trns_less',
        net: 'trns_net',
        returned: 'trns_return',
        discount: 'trns_discount',
        tended: 'trns_tended',
        loose: 'trns_change',
        method: 'trns_method',
        shift: 'trns_shift',
        status: 'trns_status',
        account: 'trns_account',
        date: 'trns_date',
    },
    // joined: {
    //     begshift: 'shft_start',
    //     begcash: 'shft_beg_cash',
    //     shift: 'shft_status',
    //     endshift: 'shft_close',
    //     endcash: 'shft_end_cash',
    //     totalhrs: 'shft_total_hrs',
    // },
    // conditional: 'LEFT JOIN pos_shift_schedule ON shft_id=trns_shift',
    // shiftRecord: `SELECT COUNT(*) + 1 AS code FROM pos_sales_transaction WHERE DATE_FORMAT(trns_date, '%Y-%m-%d')=DATE_FORMAT(now(), '%Y-%m-%d') AND trns_shift=?`,
    // shiftRecord: `SELECT IFNULL(MAX(trns_code), ?) AS code FROM pos_sales_transaction WHERE DATE_FORMAT(trns_date, '%Y-%m-%d')=DATE_FORMAT(now(), '%Y-%m-%d') AND trns_shift=?`,
    shiftRecord: `SELECT IFNULL(MAX(trns_code), ?) AS code FROM pos_sales_transaction WHERE trns_code LIKE ?`,
}

module.exports = {
    transaction
}