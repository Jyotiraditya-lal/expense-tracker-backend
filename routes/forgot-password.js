const express= require('express')
const password= require('../controllers/forgot-password')

const router= express.Router()

router.get('/forgotpassword', password.getPassword)
router.post('/forgotpassword', password.postPassword)
router.get(`/forgotpassword/:${password.Id}`, password.getUpdatedPassword)
router.post(`/forgotpassword/:${password.Id}`, password.postUpdatedPassword)

module.exports= router