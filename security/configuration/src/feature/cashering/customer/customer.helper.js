const customer = {
    name: 'pos_archive_customer',
    fields: {
        id: 'cust_id',
        name: 'cust_name',
        address: 'cust_address',
        contact: 'cust_contact',
        email: 'cust_email',
        count: 'cust_count',
        value: 'cust_value',
        waive: 'cust_waive',
        status: 'cust_status',
    },
    balanceUpdate: `UPDATE pos_archive_customer SET cust_count=(SELECT COUNT(*) FROM pos_sales_credit WHERE cred_creditor=cust_id AND cred_status='ON-GOING'),cust_value=(SELECT SUM(cred_balance) FROM pos_sales_credit WHERE cred_creditor=cust_id AND cred_status='ON-GOING'),cust_waive=(SELECT SUM(cred_waived) FROM pos_sales_credit WHERE cred_creditor=cust_id AND cred_status<>'ON-GOING') WHERE cust_id=?`
}

module.exports = {
    customer
}