import { ApiError } from "../utils/apierrors";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";



export const verifyJWT=asyncHandler(async (req,_,next)=>{ // here res is of no use so we can replace it by "_" just a standard practise
   try {
     const token=req.cookies?.accessToken || // why not we are using refreshtoken here will see in next video
      ("Authorization")?.replace("Bearer ","")
 
      if(!token){
         throw new ApiError(401,"unauthorized request ")
      }
   
 
      //verifying token
      const decodedToken = jwt.verify(token,jwt.ACCESS_TOKEN_SECRET)
     
      const user = await User.findById(decodedToken?._id).
      select("-password -refreshToken")
 
      if(!user){
         //in next video disucssion about frontend
         throw new ApiError(401,"Invalid access Token")
      }
 
      req.user=user // we are  adding user data to request
      next()
   } catch (error) {
    throw new ApiError(401,"unauthorized request")
   }

})