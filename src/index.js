// require('dotenv').config(path,'./env') this would work but we want to maintain consistancy so we are using other approach
import connectionDb from "./db/index.js"
import dotenv from "dotenv"
import {app} from "./app.js"


dotenv.config({
    path:"./env"
})

connectionDb()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running at port : ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log("Mongodb connection failed !!! ",err);//as connection returns promise we are catching error
})

//other approach is to write a connection code in db folder and export it ..






















/*
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js"
import  express  from "express";
const app=express();
//using iffis to connect
(async()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log("connection sucessfull")
    

    //listenrs if db is unable to connect profestional approach
    app.on("error",(error)=>{
              console.log("ERROR ..",error)
              throw error
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on ${process.env.PORT}`)
    })
   

  } catch (error) {
    console.error("ERROR !.....",error)
  }

})()*/