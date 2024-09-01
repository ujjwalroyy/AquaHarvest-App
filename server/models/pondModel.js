import mongoose from 'mongoose'

const pondSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users', 
            required: true
        },
        name:{
            type: String,
            required: [true, "Pond name is compulsory"],
        },
        pondType:{
            type: String,
            required:[true, "Pond type is compulsory"]
        },
        depth:{
            type: String,
            required:[true, "Please enter the depth of your pond"]
        },
        area:{
            type: String,
            required:[true, "please enter the area of pond in sq. m"]
        },
        quantity:{
            type:String,
            required:[true, "please enter the quantity of fish"]
        },
        feedType:{
            type:String,
            required:[true, "Please enter the feed type of fish"]
        },
        testDate:{
            type:Date,
            // required: [true, "Enter date"]
        },
        test: { type: String, 
            enum: ['PH', 'DO', 'XY', 'YZ'],
        }
    },{timestamps: true}
);

export const pondModel = mongoose.model("Ponds", pondSchema);
export default pondModel;