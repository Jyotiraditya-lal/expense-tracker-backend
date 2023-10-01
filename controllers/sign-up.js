const path=require('path')
const rootDir= require('../util/path')
const User= require ('../models/user')


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
        res.status(201).send('User already exists')
    }
    
}