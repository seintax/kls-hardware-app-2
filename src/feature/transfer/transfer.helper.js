const transfer = {
    name: 'pos_stock_transfer',
    fields: {
        id: 'trnr_id',
        name: 'trnr_receiver',
        trno: 'trnr_trno',
        date: 'trnr_trdate',
        remarks: 'trnr_remarks',
        count: 'trnr_count',
        value: 'trnr_value',
    },
    balanceUpdate: 'UPDATE pos_stock_transfer SET trnr_count=(SELECT COUNT(*) FROM pos_stock_transfer_item WHERE trni_tr_ref=trnr_id),trnr_value=(SELECT SUM(trni_qty * trni_price) FROM pos_stock_transfer_item WHERE trni_tr_ref=trnr_id) WHERE trnr_id=?'
}

module.exports = {
    transfer,
}