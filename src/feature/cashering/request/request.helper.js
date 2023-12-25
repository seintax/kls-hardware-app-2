const request = {
    name: 'pos_return_transaction',
    fields: {
        id: 'rtrn_id',
        code: 'rtrn_trans',
        time: 'rtrn_time',
        prevvat: 'rtrn_p_vat',
        prevtotal: 'rtrn_p_total',
        prevless: 'rtrn_p_less',
        prevnet: 'rtrn_p_net',
        rtrnvat: 'rtrn_r_vat',
        rtrntotal: 'rtrn_r_total',
        rtrnless: 'rtrn_r_less',
        rtrnnet: 'rtrn_r_net',
        discount: 'rtrn_discount',
        shift: 'rtrn_shift',
        requestedby: 'rtrn_requestedby',
        requestedon: 'rtrn_requestedon',
        authorizeby: 'rtrn_authorizeby',
        authorizeon: 'rtrn_authorizeon',
        status: 'rtrn_status',
    }
}

module.exports = {
    request
}