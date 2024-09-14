import mongoose from 'mongoose'

const subscriptionPlanSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    stripePriceId:{
        type: String,
        required: true,
    },
    trialDays:{
        type: Number,
        required: true
    },
    haveTrial:{
        type: Boolean,
        default: false
    },
    amount:{
        type:Number,
        required: true
    },
    type:{ 
        type: Number,
        required: true,
    }
},{
    timestamps: true
})

export const subscriptionPlanModel = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
export default subscriptionPlanModel;
