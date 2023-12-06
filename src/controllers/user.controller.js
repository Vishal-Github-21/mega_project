//main logic building starts here
import { asyncHandler } from "../utils/async-handler.js";


const registerUser=asyncHandler( async (req,res)=>{
  res.status(200).json({
        message:"ok"
    })
})


export {registerUser}