const transaction = require('../feature/cashering/transaction/transaction.route')
const dispensing = require('../feature/cashering/dispensing/dispensing.route')
const payment = require('../feature/cashering/payment/payment.route')
const customer = require('../feature/cashering/customer/customer.route')
const credits = require('../feature/cashering/credits/credits.route')
const schedule = require('../feature/cashering/schedule/schedule.route')
const request = require('../feature/cashering/request/request.route')
const returned = require('../feature/cashering/returned/returned.route')
const reimburse = require('../feature/cashering/reimburse/reimburse.route')
const remittance = require('../feature/cashering/remittance/remittance.route')
const collection = require('../feature/cashering/collection/collection.route')

module.exports = {
    transaction,
    dispensing,
    payment,
    customer,
    credits,
    schedule,
    request,
    returned,
    reimburse,
    remittance,
    collection
}