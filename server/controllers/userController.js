import userModel from "../models/userModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "email already taken",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
    });
    res.status(201).send({
      success: true,
      message: "Registration success, please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Add Email or Password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }
    const token = user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure:process.env.NODE_ENV === "development"?true:false,
        httpOnly:process.env.NODE_ENV === "development"?true:false,
        sameSite:process.env.NODE_ENV === "development"?true:false,
      })
      .send({
        success: true,
        message: "Login Successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error In Login Api",
      error,
    });
  }
};


//Get user profile
export const getUserProfileController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        user.password = undefined
        res.status(200).send({
            success: true,
            message: "User profile fetched successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:'Error In Profile API',
            error
        })
        
    }
}

//logout
export const logoutController = async (req, res) =>{
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure:process.env.NODE_ENV === "development"?true:false,
            httpOnly:process.env.NODE_ENV === "development"?true:false,
            sameSite:process.env.NODE_ENV === "development"?true:false,
          }).send({
            success:true,
            message:"Logout Successfully"
          })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:'Error In Logout API',
            error
        })
        
    }
}

//update profile
export const updateProfileController = async(req, res) =>{
    try {
        const user = await userModel.findById(req.user._id)
        const {name, email, address, city, country, phone} = req.body
        if(name) user.name = name
        if(email) user.email = email
        if(address) user.address = address
        if(city) user.city = city
        if(country) user.country = country
        if(phone) user.phone = phone
        //save
        await user.save()
        res.status(200).send({
            success: true,
            message: 'User Profile Updated'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:'Error In Logout API',
            error
        })
    }
}