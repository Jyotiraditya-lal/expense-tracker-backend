const jwt=require('jsonwebtoken')
const User= require('../models/user')


const authenticate = (req,res,next)=>{
    const token= localStorage.getItem('token')
    const user= jwt.verify(token,'9abr8ytd3554bfndjjw5745bngfj985') // same secret key
    User.findByPk(user.userId).then(user=>{
        req.user=user
        next()
    }).catch(err=>{
        console.log(err)
        res.send(404).json({remarks: 'Something went wrong'})
    })
}

module.exports= {
    authenticate
}