const express= require('express')
const password= require('../controllers/forgot-password')

const router= express.Router()

router.get('/forgotpassword', password.getPassword)
router.post('/forgotpassword', password.postPassword)

module.exports= router