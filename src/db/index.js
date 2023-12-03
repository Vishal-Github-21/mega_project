import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";




const connectionDb = async ()=>{

   try {
     const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`\n mongodb connected ! db host ${connectionInstance.connection.host}`)
   } catch (error) {
       console.log("ERROR!....",error);
       //instead of throwing error we are using procces
       process.exit(1)
   }

}

export default connectionDb;