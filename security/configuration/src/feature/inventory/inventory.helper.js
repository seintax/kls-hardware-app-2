const inventory = {
    name: 'pos_stock_inventory',
    fields: {
        id: 'invt_id',
        product: 'invt_product',
        sku: 'invt_sku',
        supplier: 'invt_supplier',
        drno: 'invt_drno',
        drdate: 'invt_drdate',
        reference: 'invt_dr_ref',
        received: 'invt_received',
        cost: 'invt_cost',
        stocks: 'invt_stocks',
        price: 'invt_price',
        receipt: 'invt_rct_name',
        brand: 'invt_brand',
        model: 'invt_model',
        convcount: 'invt_conv_count',
        convspare: 'invt_conv_spare',
        vatable: 'invt_vatable',
        isloose: 'invt_isloose',
        acquisition: 'invt_acquisition',
        status: 'invt_status',
    },
    joined: {
        name: "prod_name",
        details: "prod_details",
        unit: "prod_unit",
        category: "prod_category",
    },
    conditional: 'LEFT JOIN pos_stock_masterlist ON prod_id=invt_product',
    balanceAdded: 'UPDATE pos_stock_inventory SET invt_stocks=(invt_stocks + @qty),invt_trni_total=(invt_trni_total - @qty) WHERE invt_id = ?',
    balanceMinus: 'UPDATE pos_stock_inventory SET invt_stocks=(invt_stocks - @qty),invt_trni_total=(invt_trni_total + @qty) WHERE invt_id = ?',
    returnAdded: 'UPDATE pos_stock_inventory SET invt_stocks=(invt_stocks + @qty) WHERE invt_id = ?',
    returnMinus: 'UPDATE pos_stock_inventory SET invt_stocks=(invt_stocks - @qty) WHERE invt_id = ?',
}

module.exports = {
    inventory
}