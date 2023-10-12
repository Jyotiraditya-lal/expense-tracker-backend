const path=require('path')
const rootDir= require('../util/path')
const User= require ('../models/user')
const bcrypt= require('bcrypt')
const jwt=require('jsonwebtoken')


const getLogin = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'login.html'))
}
function generateToken(id,name,isPremium){
    require('dotenv').config();
    return jwt.sign({userId: id,name: name, isPremium: isPremium },process.env.SECRET_KEY) //do not push it to git or disclose it to others when working in development.
}

const postLogin = async (req,res,next)=>{

    const email= req.body.email;
    const password= req.body.password;
    const user= await User.findAll({where: {email: email}})
    if(user.length===0){
        const remarks= 'User does not exist'
        res.status(404).json({success: false, remarks: remarks})
    }else if(user.length >0){
        bcrypt.compare(password,user[0].password,(err,response)=>{
            if(err){
                const remarks= 'Something went wrong'
               res.status(500).json({success: false, remarks: remarks }) 
            }
            if(response===true) {
                const remarks= 'Logged in'
                res.status(201).json({success: true, remarks: remarks, token: generateToken(user[0].id,user[0].name,user[0].isPremium)})
                
            }else{
                const remarks= 'Incorrect password'
                res.status(401).json({success: false, remarks: remarks})
            }
        })
    }
     
}

const getSignUp = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views',  'sign-up.html'))
}

const postSignUp = async (req,res,next)=>{
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password
    const user= await User.findAll({where: {email: email }})
    if (user.length===0){
        bcrypt.hash(password, 10, async(err,hash)=>{
            await User.create({
                name: name,
                email: email,
                password: hash
            })
            
            res.status(201).json({remarks: 'New User Created'})
        })      
    }else{
        res.status(404).json({remarks: 'User already exists'})
    }
    
}

module.exports={
    getLogin,
    generateToken,
    postLogin,
    getSignUp,
    postSignUp
}

