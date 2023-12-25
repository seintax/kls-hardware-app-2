const router = require('express').Router()

router.get('/test', async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "You have a successfull api call.",
        parameters: req.query,
    })
})

module.exports = router