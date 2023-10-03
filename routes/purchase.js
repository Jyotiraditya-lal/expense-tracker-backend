const express=require('express')
const purchase= require('../controllers/purchase')
const auth= require('../middleware/auth')

const router= express.Router()

router.get('/transactions',auth.authenticate,purchase.BuyPremium)

module.exports=router