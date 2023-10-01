const express=require('express')
const signUp= require('./controllers/sign-up')
const router= express.Router()

router.get('/',signUp.getLogin)
router.post('/user/login',signUp.postLogin)
router.get('/user',signUp.getSignUp)
router.post('/user/signup',signUp.postSignUp)

module.exports= router