const prices = {
    name: 'pos_stock_price_change',
    fields: {
        id: 'chng_id',
        item: 'chng_item',
        product: 'chng_product',
        conv: 'chng_conv',
        time: 'chng_time',
        stocks: 'chng_stocks',
        oldprice: 'chng_old_price',
        newprice: 'chng_new_price',
        acquisition: 'chng_acquisition',
    },
}

module.exports = {
    prices
}