import mongoose from 'mongoose'

const pondSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users', 
            required: true
        },
        name: {
            type: String,
            required: [true, "Pond name is required"]
        },
        pondArea: {
            type: String, // Corrected to String to handle units
            required: [true, "Pond area is required"]
        },
        pondDepth: {
            type: String, // Corrected to String to handle units
            required: [true, "Pond depth is required"]
        },
        cultureSystem: {
            type: String,
            required: [true, "Culture system is required"],
            enum: ['Extensive', 'Semi-intensive', 'Intensive'],
        },
        speciesCulture: {
            type: String,
            required: [true, "Species culture is required"],
            enum: ['IMC', 'Magur', 'Singhi', 'Panga', 'Amur Carp', 'Calbasu', 'Pacu', 'Silver Grass', 'Vannamei', 'Rosen Bergi', 'Monoder'],
        },
        feedType: {
            type: String,
            required: [true, "Feed type is required"]
        },
        stockingDensity: {
            type: String,
            required: [true, "Stocking density is required"]
        },
        lastTestDate: {
            type: Date,
            required: false
        }
    }, { timestamps: true }
);

export const pondModel = mongoose.model("Ponds", pondSchema);
export default pondModel;