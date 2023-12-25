const returned = {
    name: 'pos_return_dispensing',
    fields: {
        id: 'rsal_id',
        code: 'rsal_trans',
        time: 'rsal_time',
        item: 'rsal_item',
        product: 'rsal_product',
        conv: 'rsal_conv',
        request: 'rsal_request',
        qty: 'rsal_qty',
        price: 'rsal_price',
        vat: 'rsal_vat',
        total: 'rsal_total',
        less: 'rsal_less',
        net: 'rsal_net',
        discount: 'rsal_discount',
        taxrated: 'rsal_taxrated',
    },
    joined: {
        name: "prod_name",
        details: "prod_details",
        unit: "prod_unit",
        category: "prod_category",
        vatable: "invt_vatable",
        isloose: "invt_isloose",
    },
    conditional: 'LEFT JOIN pos_stock_masterlist ON prod_id=rsal_product LEFT JOIN pos_stock_inventory ON invt_id=rsal_item',
}

module.exports = {
    returned
}