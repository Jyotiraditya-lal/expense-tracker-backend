const jwt=require('jsonwebtoken')
const User= require('../models/user')


const authenticate = (req,res,next)=>{
   
    const token = req.headers['authorization']
    const user= jwt.verify(token,'9abr8ytd3554bfndjjw5745bngfj985') // same secret key
    if(!token){
        res.status(404).json({remarks: 'token is null or undefined'})
    }

    User.findByPk(user.userId).then(user=>{
        req.user=user
        next()
    }).catch(err=>{
        console.log(err)
        res.status(404).json({remarks: 'Something went wrong'})
    })
}

module.exports= {
    authenticate
}