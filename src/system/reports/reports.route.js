const router = require('express').Router()
const service = require('./reports.query')

router.get('/reports/daily-sales', async (req, res) => {
    await service.dailySales(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/reports/daily-summary', async (req, res) => {
    await service.dailySummary(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/reports/weekly-summary', async (req, res) => {
    await service.weeklySales(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/reports/daily-receivables', async (req, res) => {
    await service.dailyReceivables(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/reports/receivable-collection', async (req, res) => {
    await service.receivableCollection(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/reports/daily-inventory', async (req, res) => {
    await service.dailyInventory(req.query, (err, ans) => {
        if (err) return res.status(200).json({
            success: false, error: err
        })
        return res.status(200).json({
            success: true,
            result: ans || {},
        })
    })
})

router.get('/reports/daily-return', async (req, res) => {
    await service.dailyReturn(req.query, (err, ans) => {
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