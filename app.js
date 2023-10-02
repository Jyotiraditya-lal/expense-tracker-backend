const bodyParser = require('body-parser')
const path=require('path')
const express= require('express')
const signUp=require('./routes/sign-up')
const expense= require('./routes/expense')
const sequelize=require('./util/database')

const app=express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'views')))

app.use(signUp)
app.use('/expense',expense)

sequelize.sync().then(result=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
