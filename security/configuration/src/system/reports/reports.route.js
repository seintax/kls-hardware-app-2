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

module.exports = router