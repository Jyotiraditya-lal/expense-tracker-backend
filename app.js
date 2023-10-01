const bodyParser = require('body-parser')
const path=require('path')
const express= require('express')
const signUp=require('./sign-up')
const sequelize=require('./util/database')

const app=express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')))

app.use(signUp)

sequelize.sync().then(result=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
