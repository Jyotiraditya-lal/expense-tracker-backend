const bodyParser = require('body-parser')
const path=require('path')
const dotenv= require('dotenv')
const express= require('express')
const signUp=require('./routes/user')
const expense= require('./routes/expense')
const payment=require('./routes/purchase')
const leaderboard= require('./routes/leaderboard')
const password= require('./routes/forgot-password')
const sequelize=require('./util/database')
const Expense= require('./models/expense')
const User = require('./models/user')
const Order= require('./models/order')
const PasswordReq= require('./models/password-req')

const app=express()

dotenv.config();

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'views')))

app.use(signUp)
app.use('/expense',expense)
app.use('/payment',payment)
app.use('/premium',leaderboard)
app.use('/password',password)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(PasswordReq)
PasswordReq.belongsTo(User)


sequelize.sync().then(result=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
