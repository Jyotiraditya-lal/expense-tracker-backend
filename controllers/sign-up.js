const path=require('path')
const rootDir= require('../util/path')
const User= require ('../models/user')


exports.getLogin = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'login.html'))
}

exports.postLogin = async (req,res,next)=>{
    console.log(req.body)
    const email= req.body.email;
    const password= req.body.password;
    const user= await User.findAll({where: {email: email}})
    console.log(user[0])
    if(user.length===0){
        const remarks= 'User does not exist'
        res.status(404).json({remarks: remarks})
    }else if(user[0].password!==password){
        const remarks= 'Incorrect password'
        res.status(404).json({remarks: remarks})
    }else{
        const remarks= 'Logged in'
        res.status(201).json({remarks: remarks})
    }
     
}

exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'sign-up.html'))
}

exports.postSignUp = async (req,res,next)=>{
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password
    const user= await User.findAll({where: {email: email }})
    if (user.length===0){
        await User.create({
           name: name,
           email: email,
           password: password
       })
       res.status(201).send('New User Created')
    }else{
        res.status(404).send('User already exists')
    }
    
}