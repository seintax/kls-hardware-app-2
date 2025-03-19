const router = require('express').Router()
const service = require('./database.query')

router.route('/database')
    .get(async (req, res) => {
        await service.getData(req.query, (err, ans) => {
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