const express= require('express')
const password= require('../controllers/forgot-password')

const router= express.Router()

router.get('/forgotpassword', password.getPassword)
router.post('/forgotpassword', password.postPassword)
router.get(`/forgotpassword/:id`, password.getUpdatedPassword)
router.post(`/forgotpassword/:id`, password.postUpdatedPassword)

module.exports= router