const User= require('../models/user')
const Expense= require('../models/expense')
const sequelize= require('../util/database')
const path=require('path')
const rootDir= require('../util/path')

const getLeaderboard= (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'leaderboard.html'))
}

const getRanking= async (req,res,next) =>{
    try{
        const users= await User.findAll()
        const expenses= await Expense.findAll()
        const userExpenses= {}
        expenses.forEach(expense => {
            if(userExpenses[expense.userId]){
                userExpenses[expense.userId]+=expense.amount
            }else{
                userExpenses[expense.userId]=expense.amount
            }
        });
        var userDetails=[]
        users.forEach((user)=>{
            userDetails.push({name: user.name, total_expense: userExpenses[user.id]|| 0})
        })
        userDetails.sort((a,b)=> b.total_expense - a.total_expense)
        res.status(200).json(userDetails)
    }catch(err){}
}

module.exports={
    getLeaderboard,
    getRanking
}