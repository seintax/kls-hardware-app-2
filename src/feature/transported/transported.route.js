const router = require('express').Router()
const service = require('./transported.query')

router.route('/transported')
    .get(async (req, res) => {
        await service.selectRecord(req.query, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })
    .post(async (req, res) => {
        await service.createRecord(req.body, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })
    .patch(async (req, res) => {
        await service.updateRecord(req.body, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })
    .delete(async (req, res) => {
        await service.deleteRecord(req.body, (err, ans) => {
            if (err) return res.status(200).json({
                success: false, error: err
            })
            return res.status(200).json({
                success: true,
                result: ans || {},
            })
        })
    })

router.get('/transported/element', async (req, res) => {
    await service.uniqueRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans.length === 1 ? ans[0] : {} || {},
        })
    })
})

router.get('/transported/search', async (req, res) => {
    await service.searchRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/transported/transfer', async (req, res) => {
    await service.transferRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/transported/inventory', async (req, res) => {
    await service.inventoryRecord(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

module.exports = router