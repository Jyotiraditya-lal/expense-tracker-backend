const path= require('path')
const rootDir= require('../util/path')
const Sib= require('sib-api-v3-sdk')

const getPassword = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'forgot-password.html'))
}

const postPassword = async (req,res,next)=>{
    try{
        require('dotenv').config()
       
        const client = Sib.ApiClient.instance

        const apiKey= client.authentications['api-key']
        apiKey.apiKey= process.env.BREVO_API

        const tranEmailApi= new Sib.TransactionalEmailsApi()

        const sender={
            email: 'lal.vaibhav0211@gmail.com'
        }

        const reciever=[
            {
                email: req.body.email
            }
        ]

        await tranEmailApi.sendTransacEmail({
            sender,
            to: reciever,
            subject: 'Forgot expense tracker password',
            textContent: `you have forgotton your password`
        })
        res.status(201).json({success: true, remarks: 'mail Sent'})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, remarks: 'Cannot send mail. please try again later'})
    }

}

module.exports={
    getPassword,
    postPassword
}