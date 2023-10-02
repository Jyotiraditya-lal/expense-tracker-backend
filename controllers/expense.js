const path=require('path')
const rootDir= require('../util/path')
const User= require ('../models/user')
const Expense= require('../models/expense')

exports.getExpense = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-expense.html'));
};

exports.postExpense = async (req,res,next) => {
    const amount= req.body.amount;
    const description = req.body.description;
    const category= req.body.category
    const Id= req.user.id
    await Expense.create({
        amount: amount,
        description: description,
        category: category,
        userId: Id
    })
    res.redirect('/expense/addexpense')
}

exports.getExpenseData = async (req,res,next)=>{
    const Id= req.user.id
    const expenses= await Expense.findAll({where: {userId: Id}})
    res.status(201).json({allexpenses: expenses})
}

exports.deleteExpense = async (req,res,next) =>{
    const expenseId= req.params.expenseId
    await Expense.destroy({where: {id: expenseId}})
    const expenses = await Expense.findAll()
    res.status(201).json({allexpenses: expenses})

}