const account = {
    name: 'sys_account',
    fields: {
        id: 'acct_id',
        name: 'acct_fullname',
        user: 'acct_username',
        pass: 'acct_password',
        token: 'acct_keytoken',
        time: 'acct_duration',
    },
    joined: {
        uid: 'user_id',
        account: 'user_account',
        last: 'user_lname',
        first: 'user_fname',
        middle: 'user_mname',
        gender: 'user_gender',
        contact: 'user_contact',
        address: 'user_address',
        display: 'user_display',
    },
    conditional: 'LEFT JOIN sys_user ON user_account=acct_id',
    tokenUpdate: 'UPDATE sys_account SET acct_keytoken=? WHERE acct_username = ?'
}

module.exports = {
    account
}