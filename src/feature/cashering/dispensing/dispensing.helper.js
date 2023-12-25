const dispensing = {
    name: 'pos_sales_dispensing',
    fields: {
        id: 'sale_id',
        code: 'sale_trans',
        position: 'sale_index',
        time: 'sale_time',
        item: 'sale_item',
        product: 'sale_product',
        conv: 'sale_conv',
        purchase: 'sale_purchase',
        dispense: 'sale_dispense',
        price: 'sale_price',
        vat: 'sale_vat',
        total: 'sale_total',
        less: 'sale_less',
        net: 'sale_net',
        discount: 'sale_discount',
        taxrated: 'sale_taxrated',
        toreturn: 'sale_toreturn',
        returned: 'sale_returned',
    },
    joined: {
        name: "prod_name",
        details: "prod_details",
        unit: "prod_unit",
        category: "prod_category",
        acquisition: "invt_acquisition",
        vatable: "invt_vatable",
        isloose: "invt_isloose",
        method: "trns_method",
    },
    conditional: 'LEFT JOIN pos_stock_masterlist ON prod_id=sale_product LEFT JOIN pos_stock_inventory ON invt_id=sale_item LEFT JOIN pos_sales_transaction ON trns_code=sale_trans',
}

module.exports = {
    dispensing
}