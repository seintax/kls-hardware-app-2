const adjustment = {
    name: 'pos_stock_adjustment',
    fields: {
        id: 'adjt_id',
        item: 'adjt_item',
        product: 'adjt_product',
        conv: 'adjt_conv',
        time: 'adjt_time',
        price: 'adjt_price',
        oldstocks: 'adjt_old_stocks',
        operator: 'adjt_operator',
        quantity: 'adjt_quantity',
        newstocks: 'adjt_new_stocks',
        details: 'adjt_details',
        remarks: 'adjt_remarks',
    },
}

module.exports = {
    adjustment
}