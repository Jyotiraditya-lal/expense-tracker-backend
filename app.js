const bodyParser = require('body-parser')
const path=require('path')
const express= require('express')
const signUp=require('./routes/sign-up')

const app=express()

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(signUp)

app.listen(3000)
