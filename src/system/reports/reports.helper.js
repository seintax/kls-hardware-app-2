const reports = {
    weeklySales: `
        SELECT 
            DATE(paym_time) AS day, 
            SUM(IF(paym_method='CASH',paym_amount,0)) AS cash,
            SUM(IF(paym_method='CHEQUE',paym_amount,0)) AS cheque,
            SUM(IF(paym_method='GCASH',paym_amount,0)) AS gcash
        FROM 
            pos_payment_collection 
                LEFT JOIN pos_sales_transaction 
                    ON trns_code = paym_trans
        WHERE 
            DATE(paym_time) BETWEEN '@fr' AND '@to' 
        GROUP BY DATE(paym_time) 
        ORDER BY DATE(paym_time) ASC
        `,
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
            DATE(paym_time) BETWEEN '@fr' AND '@to' AND 
            paym_amount > 0
        ORDER BY trns_code DESC
        `,
    dailySummary: `
        SELECT 
            paym_date AS date,
            SUM(IF(paym_method='CASH' AND paym_type='SALES', paym_amount, 0)) AS sales_cash, 
            SUM(IF(paym_method='CHEQUE' AND paym_type='SALES', paym_amount, 0)) AS sales_cheque, 
            SUM(IF(paym_method='GCASH' AND paym_type='SALES', paym_amount, 0)) AS sales_gcash, 
            (SELECT 
                SUM(trns_net) 
            FROM 
                pos_sales_transaction 
            WHERE 
                trns_method='CREDIT' AND 
                trns_date=paym_date 
            GROUP BY trns_date) AS sales_credit,
            SUM(IF(paym_method='CASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cash,
            SUM(IF(paym_method='CHEQUE' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cheque, 
            SUM(IF(paym_method='GCASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_gcash 
        FROM
            (SELECT *,DATE(paym_time) AS paym_date FROM pos_payment_collection WHERE
            paym_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59') arg
        GROUP BY paym_date
        ORDER BY paym_date DESC;
        `,
    dailyReceivables: `
        SELECT
            cust_name AS customer,
            balance
        FROM
            pos_archive_customer 
            LEFT JOIN 
                (SELECT 
                    cred_creditor,
                    SUM(cred_balance) AS balance 
                FROM 
                    pos_sales_credit 
                WHERE 
                    cred_status='ON-GOING' 
                GROUP BY 
                    cred_creditor) a
                ON a.cred_creditor=cust_id
        WHERE
            balance>0
        ORDER BY cust_name
    `,
    receivableCollection: `
        SELECT
            cred_id AS crno,
            paym_time AS time,
            cust_name AS customer,
            paym_amount AS amount,
            paym_method AS method,
            paym_refcode AS cheque,
            paym_refdate AS date
        FROM 
            pos_payment_collection,
            pos_sales_credit,
            pos_archive_customer
        WHERE
            paym_trans=cred_trans AND 
            cred_creditor=cust_id AND 
            paym_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59'
        ORDER BY paym_time
    `,
    dailyInventory: `
        SELECT
            invt_name AS name,
            invt_details AS details,
            invt_unit AS unit,
            invt_received AS received,
            invt_price AS price,
            sold,
            purchase,
            (invt_received - (sold + purchase)) AS remain
        FROM
            (SELECT 
                sale_item,
                SUM(sale_purchase) AS purchase,
                SUM(sale_dispense) AS dispense 
            FROM 
                pos_sales_dispensing
            WHERE 
                sale_time 
                    BETWEEN '@fr 00:00:01' AND '@fr 23:59:59' 
            GROUP BY sale_item) arg
                LEFT JOIN pos_stock_inventory 
                    ON invt_id=arg.sale_item,
            (SELECT 
                sale_item,
                SUM(sale_purchase) AS sold 
            FROM 
                pos_sales_dispensing
            WHERE 
                sale_time<'@fr 00:00:01' 
            GROUP BY sale_item) prior
        WHERE
            prior.sale_item=arg.sale_item
        ORDER BY invt_name
    `,
    dailyReturn: `
        SELECT
            rtrn_trans AS code,
            trns_order AS receipt,
            rtrn_time AS time,
            acct_fullname AS user,
            rtrn_p_net AS p_net,
            rtrn_r_net AS r_net
        FROM 
            pos_return_transaction,
            pos_sales_transaction,
            sys_account
        WHERE
            rtrn_trans=trns_code AND 
            rtrn_requestedby=acct_id AND 
            rtrn_status='COMPLETED' AND 
            rtrn_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
        ORDER BY rtrn_trans
    `,
}

module.exports = {
    reports
}