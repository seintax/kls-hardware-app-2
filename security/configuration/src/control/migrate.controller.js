const router = require('express').Router()
const cl = require('../../data/connection/cloud')

router.post('/upload', async (req, res) => {
    let data = req.body?.data?.split("{_}")
    let batch = await Promise.all(data?.map(async sql => {
        let response = await new Promise((resolve, reject) => {
            cl.query(sql, async (err, ans) => {
                if (err) return reject(err)
                resolve({ response: ans })
            })
        })
        return response
    }))
    return res.status(200).json({
        success: true,
        message: `${data.length} api calls have finished.`,
        response: batch,
    })
})

module.exports = router