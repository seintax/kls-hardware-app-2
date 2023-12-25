CREATE DATABASE web_jbs_hpos;
USE web_jbs_hpos;

CREATE TABLE sys_trace (
    trce_id              int auto_increment primary key,
    trce_ref             int,
    trce_details         text,
    trce_method          varchar(20),
    trce_stash           int,
    trce_date            timestamp DEFAULT now(),
    trce_user            int
);

CREATE TABLE sys_stash (
    stsh_id              int auto_increment primary key,
    stsh_table           varchar(50),
    stsh_query           text,
    stsh_pk              varchar(30)
);

CREATE TABLE sys_client (
    conf_id          int auto_increment primary key,
    conf_key         varchar(9) unique,
    conf_value       text
);

INSERT INTO sys_client (conf_key,conf_value) VALUES ('VAT','0.12');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('NAME','MY STORE');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('COMPANY','COMPANY INC.');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('ADDRESS','BRGY. SAN FRANCISCO');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('CITY','PAGADIAN CITY');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('EMAIL','company.inc@gmail.com');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('MOBILE','0919-123-4567');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('LANDLINE','(062) 924-4411');
INSERT INTO sys_client (conf_key,conf_value) VALUES ('PERMIT', NULL);
INSERT INTO sys_client (conf_key,conf_value) VALUES ('TIN', NULL);
INSERT INTO sys_client (conf_key,conf_value) VALUES ('MIN', NULL);
INSERT INTO sys_client (conf_key,conf_value) VALUES ('ACC', NULL);

CREATE TABLE sys_account (
    acct_id          int auto_increment primary key,
    acct_fullname    varchar(99),
    acct_username    varchar(99) unique,
    acct_password    text,
    acct_keytoken    text,
    acct_duration    timestamp
);

INSERT INTO sys_account (acct_fullname,acct_username,acct_password) VALUES ('DEVELOPER','SEINTAX','$2a$10$tSnuDwpZctfa5AvyRzczJu.NAFMnXXQnedJejxZSn1Hqp8XVV2fAW');

CREATE TABLE sys_user (
    user_id          int auto_increment primary key,
    user_account     int,
    user_lname       varchar(45),
    user_fname       varchar(45),
    user_mname       varchar(45),
    user_gender      varchar(3),
    user_contact     varchar(30),
    user_address     text,
    user_display     text
);

CREATE TABLE sys_access (
    cred_id          int auto_increment primary key,
    cred_account     int,
    cred_access      text
);

CREATE TABLE lib_category (
    ctgy_id          int auto_increment primary key,
    ctgy_name        varchar(75),
    ctgy_status      varchar(1) DEFAULT "A"
);

CREATE TABLE lib_measurement (
    meas_id          int auto_increment primary key,
    meas_name        varchar(99),
    meas_code        varchar(20) unique,
    meas_qty         decimal(5,2),
    meas_display     varchar(30),
    meas_method      varchar(30),
    meas_status      varchar(1) DEFAULT "A"
);

CREATE TABLE lib_discount (
    less_id          int auto_increment primary key,
    less_name        varchar(45),
    less_percent     varchar(5),
    less_rate        decimal(5,2),
    less_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_archive_supplier (
    supp_id          int auto_increment primary key,
    supp_name        varchar(99) unique,
    supp_address     varchar(150),
    supp_contact     varchar(30),
    supp_email       varchar(99),
    supp_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_archive_customer (
    cust_id          int auto_increment primary key,
    cust_name        varchar(99),
    cust_address     varchar(150),
    cust_contact     varchar(30),
    cust_email       varchar(99),
    cust_count       int DEFAULT 0,
    cust_value       decimal(30,2) DEFAULT 0,
    cust_waive       decimal(30,2) DEFAULT 0,
    cust_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_archive_files (
    file_id          int auto_increment primary key,
    file_table       varchar(30),
    file_archive     varchar(30),
    file_reference   int,
    file_name        varchar(50),
    file_path        text
);

CREATE TABLE pos_stock_masterlist (
    prod_id          int auto_increment primary key,
    prod_name        varchar(99),
    prod_details     varchar(99),
    prod_sku         varchar(99),
    prod_rct_name    varchar(20),
    prod_category    varchar(75),
    prod_unit        varchar(99),
    prod_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_stock_delivery (
    dlvr_id          int auto_increment primary key,
    dlvr_supplier    int,
    dlvr_drno        varchar(50),
    dlvr_drdate      date,
    dlvr_remarks     varchar(150),
    dlvr_count       int DEFAULT 0,
    dlvr_value       decimal(30,2) DEFAULT 0
);

CREATE TABLE pos_stock_inventory (
    invt_id          int auto_increment primary key,
    invt_product     int,
    invt_sku         varchar(99),
    invt_supplier    varchar(99),
    invt_drno        varchar(50),
    invt_drdate      date,
    invt_dr_ref      int,
    invt_received    decimal(10,2),
    invt_stocks      decimal(10,2),
    invt_cost        decimal(30,2),
    invt_price       decimal(30,2),
    invt_rct_name    varchar(20),
    invt_brand       varchar(50),
    invt_model       varchar(50),
    invt_conv_count  int DEFAULT 0,
    invt_trni_count  int DEFAULT 0,
    invt_conv_value  decimal(30,2) DEFAULT 0,
    invt_trni_value  decimal(30,2) DEFAULT 0,
    invt_conv_total  decimal(10,2) DEFAULT 0,
    invt_trni_total  decimal(10,2) DEFAULT 0,
    invt_conv_spare  decimal(10,2) DEFAULT 0,
    invt_sold_total  decimal(10,2) DEFAULT 0,
    invt_vatable     varchar(1) DEFAULT "Y",
    invt_isloose     varchar(1) DEFAULT "N",
    invt_acquisition varchar(20) DEFAULT 'PROCUREMENT',
    invt_status      varchar(1) DEFAULT "A",
    invt_category    varchar(75),
    invt_name        varchar(99),
    invt_details     varchar(99),
    invt_unit        varchar(99)
);

ALTER TABLE pos_stock_inventory ADD COLUMN invt_trni_count int DEFAULT 0 AFTER invt_conv_count;

ALTER TABLE pos_stock_inventory ADD COLUMN invt_conv_value decimal(30,2) DEFAULT 0 AFTER invt_trni_count;

ALTER TABLE pos_stock_inventory ADD COLUMN invt_trni_value decimal(30,2) DEFAULT 0 AFTER invt_conv_value;

ALTER TABLE pos_stock_inventory ADD COLUMN invt_sold_total decimal(10,2) DEFAULT 0 AFTER invt_trni_total;

ALTER TABLE pos_stock_inventory
    ADD COLUMN invt_category varchar(75),
    ADD COLUMN invt_name varchar(99),
    ADD COLUMN invt_details varchar(99),
    ADD COLUMN invt_unit varchar(99);

UPDATE pos_stock_inventory a
        INNER JOIN pos_stock_masterlist b
            ON b.prod_id = a.invt_product
    SET
        a.invt_name = b.prod_name,
        a.invt_details = b.prod_details,
        a.invt_unit = b.prod_unit,
        a.invt_category = b.prod_category;

CREATE TABLE pos_stock_conversion (
    conv_id          int auto_increment primary key,
    conv_item        int,
    conv_product     int,
    conv_sku         varchar(99),
    conv_time        timestamp DEFAULT now(),
    conv_item_unit   varchar(99),
    conv_item_qty    decimal(10,2),
    conv_prod_unit   varchar(99),
    conv_prod_qty    decimal(10,2),
    conv_stocks      decimal(10,2),
    conv_cost        decimal(30,2),
    conv_price       decimal(30,2),
    conv_rct_name    varchar(20),
    conv_brand       varchar(50),
    conv_model       varchar(50),
    conv_vatable     varchar(1) DEFAULT "Y",
    conv_isloose     varchar(1) DEFAULT "N",
    conv_acquisition varchar(20) DEFAULT 'CONVERSION',
    conv_status      varchar(1) DEFAULT "A",
    conv_ref         int unique,
    conv_item_supplier    varchar(99),
    conv_item_drno        varchar(50),
    conv_item_drdate      date,
    conv_category    varchar(75),
    conv_name        varchar(99),
    conv_details     varchar(99),
    conv_unit        varchar(99)
);

ALTER TABLE pos_stock_conversion
    ADD COLUMN conv_item_supplier varchar(99),
    ADD COLUMN conv_item_drno varchar(50),
    ADD COLUMN conv_item_drdate date,
    ADD COLUMN conv_category varchar(75),
    ADD COLUMN conv_name varchar(99),
    ADD COLUMN conv_details varchar(99),
    ADD COLUMN conv_unit varchar(99);

UPDATE pos_stock_conversion a
        INNER JOIN pos_stock_masterlist b
            ON b.prod_id = a.conv_product 
        INNER JOIN pos_stock_inventory c 
            ON c.invt_id = a.conv_item
    SET
        a.conv_item_supplier = c.invt_supplier,
        a.conv_item_drno = c.invt_drno,
        a.conv_item_drdate = c.invt_drdate,
        a.conv_name = b.prod_name,
        a.conv_details = b.prod_details,
        a.conv_unit = b.prod_unit,
        a.conv_category = b.prod_category;

CREATE TABLE pos_stock_transfer (
    trnr_id          int auto_increment primary key,
    trnr_receiver    varchar(99),
    trnr_trno        varchar(50),
    trnr_trdate      date,
    trnr_remarks     varchar(150),
    trnr_count       int DEFAULT 0,
    trnr_value       decimal(30,2) DEFAULT 0
);

CREATE TABLE pos_stock_transfer_item (
    trni_id          int auto_increment primary key,
    trni_item        int,
    trni_product     int,
    trni_trno        varchar(50),
    trni_trdate      date,
    trni_tr_ref      int,
    trni_qty         decimal(10,2),
    trni_cost        decimal(30,2),
    trni_price       decimal(30,2),
    trni_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_stock_price_change (
    chng_id          int auto_increment primary key,
    chng_item        int,
    chng_product     int,
    chng_conv        int DEFAULT 0,
    chng_time        timestamp DEFAULT now(),
    chng_stocks      decimal(10,2),
    chng_old_price   decimal(30,2),
    chng_new_price   decimal(30,2),
    chng_acquisition varchar(20) DEFAULT 'PROCUREMENT'
);

CREATE TABLE pos_sales_transaction (
    trns_id          int auto_increment primary key,
    trns_code        varchar(99) unique,
    trns_order       varchar(11),
    trns_time        timestamp DEFAULT now(),
    trns_vat         decimal(30,2),
    trns_total       decimal(30,2),
    trns_less        decimal(30,2),
    trns_net         decimal(30,2),
    trns_return      decimal(30,2) DEFAULT 0,
    trns_discount    decimal(5,2) DEFAULT 0,
    trns_tended      decimal(30,2),
    trns_change      decimal(30,2),
    trns_method      varchar(30),
    trns_shift       int,
    trns_status      varchar(20) DEFAULT 'READY',
    trns_account     int,
    trns_date        date,
    UNIQUE KEY `uniq_order` (trns_order, trns_date)
);

ALTER TABLE pos_sales_transaction ADD COLUMN trns_return decimal(30,2) DEFAULT 0 AFTER trns_net;

ALTER TABLE pos_sales_transaction ADD COLUMN trns_account int AFTER trns_status;

UPDATE pos_sales_transaction a
        INNER JOIN pos_shift_schedule b
            ON b.shft_id = a.trns_shift
    SET
        a.trns_account = b.shft_account;

CREATE TABLE pos_sales_dispensing (
    sale_id          int auto_increment primary key,
    sale_trans       varchar(99),
    sale_index       varchar(20),
    sale_time        timestamp DEFAULT now(),
    sale_item        int,
    sale_product     int,
    sale_conv        int DEFAULT 0,
    sale_purchase    decimal(10,2),
    sale_dispense    decimal(10,2),
    sale_price       decimal(30,2),
    sale_vat         decimal(30,2),
    sale_total       decimal(30,2),
    sale_less        decimal(30,2) DEFAULT 0,
    sale_net         decimal(30,2),
    sale_discount    decimal(5,2) DEFAULT 0,
    sale_taxrated    decimal(5,2) DEFAULT 0,
    sale_toreturn    decimal(10,2) DEFAULT 0,
    sale_returned    decimal(10,2) DEFAULT 0
);

CREATE TABLE pos_sales_credit (
    cred_id          int auto_increment primary key,
    cred_creditor    int,
    cred_trans       varchar(99),
    cred_time        timestamp DEFAULT now(),
    cred_total       decimal(30,2),
    cred_partial     decimal(30,2),
    cred_balance     decimal(30,2),
    cred_payment     decimal(30,2),
    cred_tended      decimal(30,2),
    cred_change      decimal(30,2),
    cred_waived      decimal(30,2),
    cred_status      varchar(30) DEFAULT "ON-GOING",
    cred_settledon   timestamp
);

CREATE TABLE pos_payment_collection (
    paym_id          int auto_increment primary key,
    paym_trans       varchar(99),
    paym_time        timestamp DEFAULT now(),
    paym_type        varchar(20) DEFAULT 'SALES',
    paym_method      varchar(30),
    paym_amount      decimal(30,2),
    paym_refcode     varchar(50),
    paym_refdate     date,
    paym_refstat     varchar(30) DEFAULT 'NOT APPLICABLE',
    paym_reimburse   int DEFAULT 0,
    paym_shift       int
);

CREATE TABLE pos_return_transaction (
    rtrn_id          int auto_increment primary key,
    rtrn_trans       varchar(99),
    rtrn_time        timestamp DEFAULT now(),
    rtrn_p_vat       decimal(30,2),
    rtrn_p_total     decimal(30,2),
    rtrn_p_less      decimal(30,2),
    rtrn_p_net       decimal(30,2),
    rtrn_r_vat       decimal(30,2),
    rtrn_r_total     decimal(30,2),
    rtrn_r_less      decimal(30,2),
    rtrn_r_net       decimal(30,2),
    rtrn_discount    decimal(5,2) DEFAULT 0,
    rtrn_shift       int,
    rtrn_requestedby int,
    rtrn_requestedon timestamp DEFAULT now(),
    rtrn_authorizeby int,
    rtrn_authorizeon timestamp,
    rtrn_status      varchar(20) DEFAULT 'REQUESTING'
);

CREATE TABLE pos_return_dispensing (
    rsal_id          int auto_increment primary key,
    rsal_trans       varchar(99),
    rsal_time        timestamp DEFAULT now(),
    rsal_item        int,
    rsal_product     int,
    rsal_conv        int,
    rsal_request     int,
    rsal_qty         decimal(10,2),
    rsal_price       decimal(30,2),
    rsal_vat         decimal(30,2),
    rsal_total       decimal(30,2),
    rsal_less        decimal(30,2),
    rsal_net         decimal(30,2),
    rsal_discount    decimal(5,2) DEFAULT 0,
    rsal_taxrated    decimal(5,2) DEFAULT 0
);

CREATE TABLE pos_return_reimbursement (
    reim_id          int auto_increment primary key,
    reim_trans       varchar(99),
    reim_time        timestamp DEFAULT now(),
    reim_request     int,
    reim_method      varchar(30),
    reim_amount      decimal(30,2),
    reim_refcode     varchar(50),
    reim_account     int,
    reim_shift       int
);

CREATE TABLE pos_shift_schedule (
    shft_id          int auto_increment primary key,
    shft_account     int,
    shft_start       timestamp DEFAULT now(),
    shft_beg_cash    decimal(30,2) DEFAULT 0,
    shft_status      varchar(20) DEFAULT 'START',
    shft_close       timestamp,
    shft_end_cash    decimal(30,2) DEFAULT 0,
    shft_total_hrs   varchar(10)
);

CREATE TABLE pos_shift_remittance (
    rmtt_id          int auto_increment primary key,
    rmtt_account     int,
    rmtt_shift       int,
    rmtt_time        timestamp DEFAULT now(),
    rmtt_amount      decimal(30,2),
    rmtt_collection  decimal(30,2),
    rmtt_reviewedby  int,
    rmtt_approvedby  int
);

CREATE TABLE pos_shift_rcd (
    crcd_id          int auto_increment primary key,
    crcd_account     int,
    crcd_shift       int,
    crcd_time        timestamp DEFAULT now(),
    crcd_bills       int DEFAULT 0,
    crcd_php_2k      int DEFAULT 0,
    crcd_php_1k      int DEFAULT 0,
    crcd_php_5h      int DEFAULT 0,
    crcd_php_2h      int DEFAULT 0,
    crcd_php_1h      int DEFAULT 0,
    crcd_php_50      int DEFAULT 0,
    crcd_php_20      int DEFAULT 0,
    crcd_php_10      int DEFAULT 0,
    crcd_php_5p      int DEFAULT 0,
    crcd_php_1p      int DEFAULT 0,
    crcd_php_0c      int DEFAULT 0,
    crcd_total       decimal(30,2)
);