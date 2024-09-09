import mongoose from 'mongoose'

const testSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users', 
            required: true
        },
        testDate:{
            type:Date,
            required: [true, "Enter date"]
        },
        PH:{
            type:Number,
            required: [true, "Enter PH value"]
        },
        temperature:{
            type:Number,
            required: [true, "Enter temperature"]
        },
        DO:{
            type:Number,
            required: [true, "Enter DO"]
        },
        TDS:{
            type:Number,
            required: [true, "Enter TDS"]
        },
        turbidity:{
            type:Number,
            required: [true, "Enter turbidity"]
        },
        plankton:{
            type:Number,
            required: [true, "Enter plankton"]
        },
        fishLength:{
            type:Number,
            required: [true, "Fish length is required"]
        },
        fishWeight:{
            type:Number,
            required: [true, "Fish weight is required"]
        },
    }, {timestamps: true}
);

export const testModel = mongoose.model("Tests", testSchema);
export default testSchema