import express from "express";
// import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import session from "express-session";
import passport from './config/auth.js';
import Razorpay from 'razorpay'

dotenv.config();

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();

// app.use(morgan("dev"));

app.use(express.json());

app.use(cors({ origin: '*' }));

app.use(cookieParser());

app.use(
    session({
      secret: "mysecretkey",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );


  app.use(passport.initialize());
  app.use(passport.session());

import test1 from "./routes/test.js";
import authRoute from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import pondRoutes from "./routes/pondRoutes.js"
import expenseIncomeRoutes from './routes/expenseIncomeRoutes.js'
import passbookRoutes from './routes/passbookRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import pondTestRoutes from './routes/pondTestRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import farmInventoryRoutes from './routes/farmInventoryRoutes.js'
import gallaryRoutes from './routes/gallaryRoutes.js'
app.use("/api/v1", test1);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use('/auth', authRoute);
app.use('/api', protectedRoutes);
app.use('/api/v1/pond', pondRoutes)
app.use('/api/v1/expense-income', expenseIncomeRoutes)
app.use('/api/v1/passbook', passbookRoutes);
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1",pondTestRoutes)
app.use("/api/v3/admin", adminRoutes)
app.use("/api/v1/inventory", farmInventoryRoutes)
app.use("/api/v1/gallary", gallaryRoutes)

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET
})

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(
    `Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} mode`
  );
});
