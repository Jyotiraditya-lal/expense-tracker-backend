const path=require('path')
const rootDir= require('../util/path')

exports.getSignUp = (req,res,next)=>{
    res.sendFile(path.join(rootDir, 'views', 'sign-up.html'))
}

exports.postSignUp = (req,res,next)=>{
    const name= req.body.name;
    const email= req.body.email;
    const password= req.body.password
    console.log(name,email,password)
    res.status(201).send('Req made successfully')
}