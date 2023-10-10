const RazorPay= require('razorpay')
const Order= require('../models/order')
const signup = require('./sign-up') 

exports.BuyPremium = async (req,res,next) => {
    try{
        require('dotenv').config();
        var rzp= new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount= 2500
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                console.error("Error creating Razorpay order:", err);
                return res.status(500).json({ error: "Error creating order" });
            }
        
           req.user.createOrder({ orderid: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch((err) => {
                    console.error("Error creating order record:", err);
                    return res.status(500).json({ error: "Error creating order record" });
                });
        });
        
    }catch(err){
        console.log(err)
        
    }
} 

exports.updatetransactions = async (req,res,next) =>{
    try{
        const userId= req.user.id
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderid: order_id}})
        await order.update({payment_id: payment_id, status: 'SUCCESSFUL'})
        await req.user.update({isPremium: true})
        res.status(201).json({success: true, remarks: 'transaction successful', token: signup.generateToken(userId,undefined,true)})

    }catch(err){
        console.log(err)
        res.status(404).json({success: true, remarks: 'transaction failed'})

    }
}

