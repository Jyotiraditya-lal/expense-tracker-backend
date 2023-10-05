const RazorPay= require('razorpay')
const Order= require('../models/order')

exports.BuyPremium = async (req,res,next) => {
    try{
        require('dotenv').config();
        console.log(process.env.RAZORPAY_KEY_ID)
        //console.log(req.user)
        var rzp= new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount= 2500
        console.log(rzp.orders)
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                console.error("Error creating Razorpay order:", err);
                return res.status(500).json({ error: "Error creating order" });
            }
        
            Order.create({ orderid: order.id, status: 'PENDING' })
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
        res.status(401)
    }
} 

exports.updatetransactions = async (req,res,next) =>{
    try{
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderid: order_id}})
        await order.update({payment_id: payment_id, status: 'SUCCESSFUL'})
        await req.user.update({isPremium: true})
        res.status(201).json({success: true, remarks: 'transaction successful'})

    }catch(err){
        console.log(err)
        res.status(404).json({success: true, remarks: 'transaction failed'})

    }
}

