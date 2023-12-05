import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true//used for optimum searching
             },
    email:{
               type:String,
               required:true,
               unique:true,
               lowercase:true,
               trim:true
          },
    fullName:{
               type:String,
               required:true,
               unique:true,
               trim:true,
               index:true
          },
    avatar:{
               type:String,//cloudinary url
               required:true,
       },
    coverImage:{
               type:String,//cloudinary url
               
       },
       watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
},
       password:{
           type:String,
           required:[true,'Password is required']
       },
       refreshToken:{
        type:String
       }
},{timestamps:true})


//encrypting before saving the password
userSchema.pre("save",async function(next){
         if(!this.isModified("password")) return next();//checking if password is not modified then send it to next if modified then hash password
         this.password=bcrypt.hash(this.password,10)//how many rounds of hashing in this case 10
         next()
})


//comparing password in db
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

//writing methods to genreate tokens
userSchema.methods.generateAccessToken=function (){
   return jwt.sign(
        {
            _id:this.id,// writing payload (payload is ntg but fancy way of telling jwt to inject data )
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function (){
  return jwt.sign(
                  
    {
        _id:this.id,// writing payload (payload is ntg but fancy way of telling jwt to inject data )
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }

  ) 

}



export const User=mongoose.model("User",userSchema)