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
        const users= await User.findAll({
            attributes: ['id','name',[sequelize.fn('sum', sequelize.col('expenses.amount')),'total_expense']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['users.id'],
            order: [['total_expense',"DESC"]]
        })
        
        res.status(200).json(users)
    }catch(err){}
}

module.exports={
    getLeaderboard,
    getRanking
}