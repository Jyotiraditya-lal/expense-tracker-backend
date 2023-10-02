const express=require('express')
const expense=require('../controllers/expense')
const auth = require('../middleware/auth')

const router= express.Router()

router.get('/addexpense',expense.getExpense)
router.post('/addexpense',auth.authenticate, expense.postExpense)
router.get('/fetchexpenses',auth.authenticate , expense.getExpenseData)
router.delete('/deleteexpense/:expenseId',auth.authenticate, expense.deleteExpense)


module.exports=router