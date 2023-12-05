import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app=express();


// to set up middleware of from where all we can expect result
app.use(cors({
    origin : process.env.CORS_ORIGIN,//to setup cors origin in .env
    Credential:true
}))

//accepting data from different source

app.use(express.json({limit : "16kb"})) // setting limit that how much we can accept
// app.use(express.urlencoded()) // even this much work , with extended we are allowing to accept nested objects
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))// from public folder


//using cookieparser as of now will update the functionality later
app.use(cookieParser())



export default express;