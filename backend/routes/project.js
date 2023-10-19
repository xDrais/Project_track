const express = require('express')

const router = express.Router()
const {comment , uncomment} = require('../Controllers/project')

router.post('/com/:id',comment)
router.post('/uncom/:id',uncomment)
module.exports = router