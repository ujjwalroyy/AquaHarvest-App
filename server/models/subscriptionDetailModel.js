import mongoose from "mongoose";

const subscriptionDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
    },
    stripeSubscriptionScheduleId: {
      type: String,
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    subscriptionPlanPriceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    planAmount: {
      type: Number,
      required: true,
    },
    planAmountCurrency: {
      type: String,
      required: true,
    },
    planInterval: {
      type: String,
      required: false,
    },
    planIntervalCount: {
      type: Number,
      required: false,
    },
    created: {
      type: Date,
      required: true,
    },
    planPeriodStart: {
      type: Date,
      required: true,
    },
    planPeriodEnd: {
      type: Date,
      required: true,
    },
    trialEnd: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      required: true,
    },
    cancle:{
        type: Boolean,
        default: false
    },
    canceledAt:{
        type: Date, 
        default: null
    },
  },
  {
    timestamps: true,
  }
);

export const subscriptionDetailModel = mongoose.model(
  "SubscriptionDetail",
  subscriptionDetailSchema
);
export default subscriptionDetailModel;
