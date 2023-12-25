const delivery = {
    name: 'pos_stock_delivery',
    fields: {
        id: 'dlvr_id',
        supplier: 'dlvr_supplier',
        drno: 'dlvr_drno',
        date: 'dlvr_drdate',
        remarks: 'dlvr_remarks',
        count: 'dlvr_count',
        value: 'dlvr_value',
    },
    joined: {
        name: 'supp_name',
    },
    conditional: 'LEFT JOIN pos_archive_supplier ON supp_id=dlvr_supplier',
    balanceUpdate: 'UPDATE pos_stock_delivery SET dlvr_count=(SELECT COUNT(*) FROM pos_stock_inventory WHERE invt_dr_ref=dlvr_id),dlvr_value=(SELECT SUM(invt_received * invt_cost) FROM pos_stock_inventory WHERE invt_dr_ref=dlvr_id) WHERE dlvr_id=?'
}

module.exports = {
    delivery
}