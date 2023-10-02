const express=require('express')
const expense=require('../controllers/expense')

const router= express.Router()

router.get('/addexpense',expense.getExpense)
router.post('/addexpense',expense.postExpense)
router.get('/fetchexpenses',expense.getExpenseData)
router.delete('/deleteexpense/:expenseId',expense.deleteExpense)


module.exports=router