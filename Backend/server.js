import dotenv from 'dotenv'
// Load environment variables FIRST — before any module reads process.env
dotenv.config();


import connectDB from './src/config/db.js'
connectDB();


import express from 'express'
import authRoutes from './src/routes/auth.routes.js'
//import notFound from './src/middleware/notFound.middleware.js'
//import errorHandler from './src/middleware/errorHandler.middleware.js'
import cors from 'cors'

const app = express();



app.use(express.json())//Middleware to parse JSON body recevied from frontend for post request



app.use('/auth',authRoutes);

//app.use(notFound);

//app.use(errorHandler)//always LAST


const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

