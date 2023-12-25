const transported = {
    name: 'pos_stock_transfer_item',
    fields: {
        id: 'trni_id',
        item: 'trni_item',
        product: 'trni_product',
        trno: 'trni_trno',
        trdate: 'trni_trdate',
        reference: 'trni_tr_ref',
        qty: 'trni_qty',
        cost: 'trni_cost',
        price: 'trni_price',
        status: 'trni_status',
    },
    joined: {
        name: "prod_name",
        details: "prod_details",
        unit: "prod_unit",
        category: "prod_category",
        supplier: 'invt_supplier',
        drno: 'invt_drno',
        drdate: 'invt_drdate',
        received: 'invt_received',
        cost: 'invt_cost',
        stocks: 'invt_stocks',
        price: 'invt_price',
    },
    conditional: 'LEFT JOIN pos_stock_inventory ON invt_id=trni_item LEFT JOIN pos_stock_masterlist ON prod_id=trni_product'
}

module.exports = {
    transported
}