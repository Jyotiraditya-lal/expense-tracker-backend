const path= require('path')
const rootDir= require('../util/path')
const Sib= require('sib-api-v3-sdk')
const {v4: uuidv4}= require('uuid')
const User= require('../models/user')
const PasswordReq= require('../models/password-req')
const sequelize = require('../util/database')
const bcrypt= require('bcrypt')

const getPassword = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'forgot-password.html'))
}

var Id=null;

const postPassword = async (req,res,next)=>{
    const transaction= await sequelize.transaction()
    try{
        require('dotenv').config()
       
        const client = Sib.ApiClient.instance

        const apiKey= client.authentications['api-key']
        apiKey.apiKey= process.env.BREVO_API

        const tranEmailApi= new Sib.TransactionalEmailsApi()

        const sender={
            email: 'lal.vaibhav0211@gmail.com',
            name: 'Vaibhav'
        }

        const reciever=[
            {
                email: req.body.email
            }
        ]

        Id= uuidv4()
        const userid= await User.findAll({
            attributes: ['id','name'],
            where: {email: req.body.email}
        })
        

        await PasswordReq.create({
            id: Id,
            userid: userid[0].id,
            isActive: true
        },{
            transaction: transaction
        })

        await tranEmailApi.sendTransacEmail({
            sender,
            to: reciever,
            subject: 'Forgot expense tracker password',
            textContent: `Dear {{params.name}}

            Please reset your password using the following link
            {{params.link}}

            Regards
            Vaibhav
            Expense tracker team
            `,params: {
                name: userid[0].name,
                link: `http://localhost:3000/password/forgotpassword/${Id}`
            }
        },{
            transaction: transaction
        })
        transaction.commit()
        res.status(201).json({success: true, remarks: 'mail Sent'})
    }catch(err){
        transaction.rollback()
        console.log(err)
        res.status(500).json({success: false, remarks: 'Cannot send mail. please try again later'})
    }

}

const getUpdatedPassword= (req,res,next) => {
    res.sendFile(path.join(rootDir, 'views', 'new-password.html'), {Id})
}

const postUpdatedPassword = async (req,res,next) => {
    const transaction= await sequelize.transaction()
    try{
        console.log(req.body)
        const passReq= await PasswordReq.findAll({
            where: {id: req.body.Id}
        },{transaction: transaction})
        console.log(passReq)

        if(passReq[0].isActive){
            const user= await User.findAll({
                where: {id: passReq[0].userid}
            },{transaction: transaction})
            console.log(user)
    
            bcrypt.hash(req.body.newPassword,10,async (err,hash)=>{
                await user.update({
                    password: hash
                },{transaction: transaction})
            })
        }

        await passReq.update({isActive: false},{ transaction: transaction})
        transaction.commit() 
        res.status(201).json({success: true, remarks: 'Password Updated successfully'})
    }catch(err){
        console.log(err)
        transaction.rollback()
        res.status(500).json({success: false, remarks: 'cannot update password'})
    }
} 

module.exports={
    getPassword,
    postPassword,
    Id,
    getUpdatedPassword,
    postUpdatedPassword
}