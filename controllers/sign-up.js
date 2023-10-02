const path=require('path')
const rootDir= require('../util/path')
const User= require ('../models/user')
const bcrypt= require('bcrypt')


exports.getLogin = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'login.html'))
}

exports.postLogin = async (req,res,next)=>{

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
                res.status(201).json({success: true, remarks: remarks})
                
            }else{
                const remarks= 'Incorrect password'
                res.status(401).json({success: false, remarks: remarks})
            }
        })
    }
     
}

exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views',  'sign-up.html'))
}

exports.postSignUp = async (req,res,next)=>{
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