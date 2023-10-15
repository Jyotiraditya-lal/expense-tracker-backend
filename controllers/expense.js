const path=require('path')
const rootDir= require('../util/path')
const User= require('../models/user')
const Expense= require('../models/expense')
const sequelize = require('../util/database')
const { v1: uuidv1} = require('uuid');


exports.getExpense = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-expense.html'));
};

exports.postExpense = async (req,res,next) => {
    const transaction= await sequelize.transaction()
    try{
        const amount= req.body.amount;
        const description = req.body.description;
        const category= req.body.category
        const Id= req.user.id
        const user= await  User.findByPk(Id)
        if (!user) {
            throw new Error('User not found');
        }
        const currentTotalExpense = user.totalExpense || 0;
        const newTotalExpense = Number(currentTotalExpense) + Number(amount);
        await user.update({ totalExpense: newTotalExpense }, {transaction: transaction})
        await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: Id
        },{
            transaction: transaction
        })
        await transaction.commit()
        res.redirect('/expense/addexpense')
    }catch(err){
        await transaction.rollback()
        console.log(err)
        res.status(500)
    }
    
}

exports.getExpenseData = async (req,res,next)=>{
    try{
        const Id= req.user.id
        const expenses= await Expense.findAll({where: {userId: Id}})
        const  totalExpense= await User.findOne({
            attributes: ['totalExpense'],
            where: {id: Id}
        })
        res.status(201).json({allexpenses: expenses, totalExpense: totalExpense})
    }catch(err){
        console.log(err)
        res.status(500)
    }
}

exports.deleteExpense = async (req,res,next) =>{
    const transaction= await sequelize.transaction()
    try{
        const expenseId= req.params.expenseId
        const Id= req.user.id
        const amount= await Expense.findAll({
            attributes: ['amount'],
            where: {id: expenseId},
            transaction: transaction
        })
        
        const user= await  User.findByPk(Id)
        if (!user) {
            throw new Error('User not found');
        }
        const currentTotalExpense = user.totalExpense;
        const newTotalExpense = Number(currentTotalExpense) - Number(amount[0].amount);
        await user.update({ totalExpense: newTotalExpense }, {transaction: transaction})
        await Expense.destroy({where: {id: expenseId}, transaction: transaction})
        const expenses = await Expense.findAll()
        await transaction.commit()
        res.status(201).json({allexpenses: expenses})
    }catch(err){
        await transaction.rollback()
        console.log(err)
        res.status(500)
    }
    

}

exports.downloadExpenses =  async (req, res) => {

    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; 
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        const containerName = 'Expense-Tracker'; 

        console.log('\nCreating container...');
        console.log('\t', containerName);

        const containerClient = await blobServiceClient.getContainerClient(containerName);

        if(!containerClient.exists()){
        
            const createContainerResponse = await containerClient.create({ access: 'container'});
            console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
        }
        
        const blobName = 'expenses' + uuidv1() + '.txt';

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        const data =  JSON.stringify(await req.user.getExpenses());

        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

        const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
        res.status(201).json({ fileUrl, success: true}); 
    } catch(err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
    }

};