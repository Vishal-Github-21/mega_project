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




//routes import

import userRouter from "./routes/users.routes.js";



//routes declaration


//this is how we used to write before setting up routes 
//now as we creataed diffrent routes file so we need to use middleware

// Responds to GET requests at the root URL '/'
app.get('/', (req, res) => {
    res.send('Hello, this is the homepage!');
  });
  


//this is the way
// app.use("/users",userRouter)//this is how but we need to define api for proper practise here below
app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users


export {app};