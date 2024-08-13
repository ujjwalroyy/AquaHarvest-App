import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'


dotenv.config()

//database
connectDB()

//rest object
const app = express()

app.use(morgan("dev"))

app.use(express.json())

app.use(cors())

app.use(cookieParser())



//routes
import test1 from './routes/test.js'
import userRoutes from './routes/userRoute.js'
app.use('/api/v1', test1)
app.use('/api/v1/user', userRoutes)



app.get('/', (req, res) =>{
    return res.status(200).send("<h1> Welcome to server<h1/>")
})  //root

const PORT = process.env.PORT || 5050

//listen
app.listen(PORT, () =>{
    console.log(`Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} mode`);
})

