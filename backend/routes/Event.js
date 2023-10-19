const express = require('express')

const router = express.Router()
const {participate,outparticipate,getparti} = require('../Controllers/crowfunding/eventController')

router.post('/participate',participate)
router.post('/exiteparticipate',outparticipate)
router.get('/getparti/:eventId',getparti)
module.exports = router