import categoryModel from "../models/categoryModel.js";


//create category
export const createCategory = async(req, res) =>{
    try {
        const {category} = req.body
        if(!category){
            return res.status(404).send({
                success: false,
                message: 'Please provide category name'
            })
        }
        await categoryModel.create({category})
        res.status(201).send({
            success: true,
            message: `${category} category created successfully`
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Create Cat API'
        })
        
    }
}