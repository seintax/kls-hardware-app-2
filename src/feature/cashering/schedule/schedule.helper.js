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
    balanceUpdate: 'UPDATE pos_shift_schedule SET shft_end_cash=(shft_beg_cash + (SELECT SUM(paym_amount) FROM pos_payment_collection WHERE paym_shift=shft_id)) WHERE shft_id=?',
    transferUpdate: {
        payment: `UPDATE pos_payment_collection SET paym_trans='@new',paym_shift='@sto' WHERE paym_trans='@old'`,
        reimburse: `UPDATE pos_return_reimbursement SET reim_trans='@new',reim_shift='@sto' WHERE reim_trans='@old'`,
        returnitems: `UPDATE pos_return_dispensing SET rsal_trans='@new' WHERE rsal_trans='@old'`,
        returnrequest: `UPDATE pos_return_transaction SET rtrn_trans='@new',rtrn_shift='@sto' WHERE rtrn_trans='@old'`,
        credit: `UPDATE pos_sales_credit SET cred_trans='@new' WHERE cred_trans='@old'`,
        dispensed: `UPDATE pos_sales_dispensing SET sale_trans='@new' WHERE sale_trans='@old'`,
        transaction: `UPDATE pos_sales_transaction SET trns_code='@new',trns_shift='@sto' WHERE trns_code='@old'`,
    }
}

module.exports = {
    schedule
}