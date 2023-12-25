const reports = {
    dailySales: `
        SELECT 
            paym_trans AS code, 
            trns_order AS receipt,
            paym_type AS type,
            paym_amount AS amount,
            paym_method AS method,
            paym_refcode AS cheque,
            paym_refdate AS date
        FROM 
            pos_payment_collection 
                LEFT JOIN pos_sales_transaction 
                    ON trns_code = paym_trans
        WHERE 
            DATE(paym_time) BETWEEN '@fr' AND '@to' 
        ORDER BY paym_time DESC
        `,
    dailySummary: `
        SELECT 
            DATE(paym_time) AS date,
            SUM(IF(paym_method='CASH' AND paym_type='SALES', paym_amount, 0)) AS sales_cash, 
            SUM(IF(paym_method='CHEQUE' AND paym_type='SALES', paym_amount, 0)) AS sales_cheque, 
            SUM(IF(paym_method='GCASH' AND paym_type='SALES', paym_amount, 0)) AS sales_gcash, 
            SUM(IF(paym_method='CASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cash, 
            SUM(IF(paym_method='CHEQUE' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cheque, 
            SUM(IF(paym_method='GCASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_gcash 
        FROM 
            pos_payment_collection 
        WHERE 
            DATE(paym_time) BETWEEN '@fr' AND '@to'
        GROUP BY DATE(paym_time)
        ORDER BY DATE(paym_time) desc
        `
}

module.exports = {
    reports
}