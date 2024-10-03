import express from 'express';
import dotenv from 'dotenv'
import dbconnection from './utils/DBconnection.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import router from './routes/Router.js';
import { errorHandler, routeNotFound } from './middleware/errorMiddleware.js';


dotenv.config();

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
    dbconnection()

})
app.get("/", (req, res) => {
    res.send("Welcome to Task Management Application.....",
        "getting for all Api checking my git repository : https://github.com/boradkrutil/Task_Management_App/tree/main/routes"  
    )
})
app.use("/api", router)

app.use(routeNotFound)
app.use(errorHandler)