import { instance } from "../server.js"
import userModel from "../models/userModel.js"
import crypto from 'crypto'

export const buySubscription = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === 'admin') {
            return next(new Error("Admin can't buy subscription"));
        }

        const plan_id = process.env.PLAN_ID || 'plan_7wAosPWtrkhqZw';

        const subscription = await instance.subscriptions.create({
            plan_id: plan_id,
            customer_notify: 1,
            total_count: 12,
        });

        user.subscription = {
            id: subscription.id,
            status: subscription.status,
        };

        await user.save();

        res.status(201).json({
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
            },
        });
    } catch (error) {
        console.error('Error in buySubscription:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};


export const paymentVerification = async (req, res, next) => {

    const {razorpay_signature, razorpay_payment_id, razorpay_subscription_id} = req.body
    try {
        const user = await userModel.findById(req.user._id);
        const subscription_id = user.subscription.id
        const generated_signature= crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(razorpay_payment_id + "|"+subscription_id, "utf-8").digest("hex")
        
        const isAuthentic = generated_signature === razorpay_signature;
        if(!isAuthentic) return res.redirect(`http://192.168.43.60:8081`)

        await Payment.create({
            razorpay_signature,
            razorpay_payment_id,
            razorpay_subscription_id
        })
        user.subscription.status="active"
        await user.save()
        res.status(201).json({
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
            },
        });
    } catch (error) {
        console.error('Error in buySubscription:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

