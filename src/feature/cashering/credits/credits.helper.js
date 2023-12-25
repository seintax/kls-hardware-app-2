const credits = {
    name: 'pos_sales_credit',
    fields: {
        id: 'cred_id',
        customer: 'cred_creditor',
        code: 'cred_trans',
        time: 'cred_time',
        total: 'cred_total',
        partial: 'cred_partial',
        balance: 'cred_balance',
        payment: 'cred_payment',
        tended: 'cred_tended',
        loose: 'cred_change',
        waived: 'cred_waived',
        status: 'cred_status',
        settledon: 'cred_settledon',
    },
    joined: {
        ordno: 'trns_order',
    },
    conditional: 'LEFT JOIN pos_sales_transaction ON trns_code=cred_trans',
    balanceUpdate: `UPDATE pos_sales_credit SET cred_total=(cred_total - @amt), cred_balance=(cred_balance - @amt) WHERE cred_status='ON-GOING' AND cred_trans=?`,
    returnUpdate: `UPDATE pos_sales_credit SET cred_total=0, cred_balance=0,cred_status='RETURNED' WHERE cred_status='ON-GOING' AND cred_trans=?`
}

module.exports = {
    credits
}    