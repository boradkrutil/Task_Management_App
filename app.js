import express from 'express';
import dotenv from 'dotenv'
import dbconnection from './utils/DBconnection.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import router from './routes/Router.js';
import { errorHandler, routeNotFound } from './middleware/errorMiddleware.js';


dotenv.config();
dbconnection()

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api",router)

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("Welcome to Task Management Application.....")
})
app.listen(PORT,()=>{
    console.log("Server listening on port " +PORT);
})
app.use(routeNotFound)
app.use(errorHandler)