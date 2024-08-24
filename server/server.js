import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import session from "express-session";
import passport from './config/auth.js';
// import './config/auth.js';

dotenv.config();

//database
connectDB();

//cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//rest object
const app = express();

app.use(morgan("dev"));

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

//routes
import test1 from "./routes/test.js";
import authRoute from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
app.use("/api/v1", test1);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cat", categoryRoutes);
app.use('/', authRoute);

// app.get("/", (req, res) => {
//   return res.status(200).send("<h1> Welcome to server<h1/>");
// }); //root

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

const PORT = process.env.PORT || 5050;

//listen
app.listen(PORT, () => {
  console.log(
    `Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} mode`
  );
});
