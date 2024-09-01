import mongoose from 'mongoose'
const marketPlaceSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        }
    }
)