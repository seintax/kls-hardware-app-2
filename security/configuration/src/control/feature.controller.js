const supplier = require('../feature/supplier/supplier.route')
const masterlist = require('../feature/masterlist/masterlist.route')
const delivery = require('../feature/delivery/delivery.route')
const inventory = require('../feature/inventory/inventory.route')
const transfer = require('../feature/transfer/transfer.route')
const transported = require('../feature/transported/transported.route')

module.exports = {
    supplier,
    masterlist,
    delivery,
    inventory,
    transfer,
    transported,
}