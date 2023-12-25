const router = require('express').Router()
const cl = require('../../data/connection/cloud')
const br = require('../../data/connection/branch')

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

router.get('/download', async (req, res) => {
    await br.query(req.query?.sql, async (err, ans) => {
        if (err) return res.status(200).json({ success: false, error: err })
        return res.status(200).json({
            success: true,
            message: `Data request calls have retrieved ${ans.length} record/s.`,
            response: ans
        })
    })
    return res.status(401)
})

module.exports = router