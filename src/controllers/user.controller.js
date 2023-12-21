//main logic building starts here
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/apierrors.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponses.js"
import jwt from "jsonwebtoken"

// as we are going to genrate access and refresh token many a times so its better to write seprate method for it

const generateAccessAndRefreshToken = async (userId) => {
  let accessToken
  let refreshToken
  try {
    const user = await User.findById(userId)
    
     accessToken = user.generateAccessToken()
     refreshToken = user.generateRefreshToken()
    
    
    //saving refreshToken in mongodb
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false }) // validateBeforeSave : false cause we dont need to enter password again to save refreshtoken in mongo

  } catch(error) {
    console.log(error.message)
    throw new ApiError(500, "error while generating access and refresh token")
  }
  return { accessToken, refreshToken }
}


//logic to register user
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //       message:"ok"



  //get user deatails from frontend✅
  //validation - not empty and many more✅
  //check if user already exists: username,email ✅
  //check for images,check for avatar✅
  //upload them to cloudinary,avatar✅
  //create user object - create entry in db {as mongodb is nosql db}✅
  //remove password and refresh token field from response (because we are sending to frontend)✅
  // check for user creation✅
  //return res✅



  //get user deatails from frontend


  const { fullName, email, username, password } = req.body
  // console.log("email", email);

  //beginer code
  //  if(fullName==""){
  //   throw new ApiError{400,"fullname is required"}
  //  }


  //validation - not empty and many more
  if (
    [fullName, email, username, password].some((field) =>
      field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  //validation
  const existedUser = await User.findOne({

    $or: [{ username }, { email }]

  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists ")
  }

  console.log(req.files);

  const avatarlocalPath = req.files?.avatar[0]?.path //getting the path of the avatar uploaded by multer

  //error we faced so commeting out below line of code and checking in a classic way
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  } else {

  }




  //check for images,check for avatar

  if (!avatarlocalPath) {
    throw new ApiError(400, "avatar file is required")
  }


  //upload them to cloudinary,avatar
  const avatar = await uploadOnCloudinary(avatarlocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)


  //as avatar is must so we are checking for validation
  if (!avatar) {
    throw new ApiError(400, "avatar file is required")
  }

  //create user object - create entry in db {as mongodb is nosql db}
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // as coverimage is not compulasory field
    email,
    password,
    username: username.toLowerCase()
  })


  //remove password and refresh token field from response (because we are sending to frontend)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //default everything is selected so we write which we dont want
  )

  //finding user has been created or not
  if (!createdUser) {
    throw new ApiError(500, "something went worng while registering user ")
  }


  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registred successfully")
  )


})


const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  // username or email verification
  //password check
  //access and refresh token generation
  // send cookies to user



  //req body -> data 
  const { email, username, password } = req.body

  // username or email verification

  if (!(username || email)) {
    throw new ApiError(400, "username or email required")
  }
  //  console.log("well")

  // const user = await User.findById({
  //   $or: [{username}, {email}]
  // })

  const user = await User.findOne({
    $or: [
      { username: username }, // Assuming 'username' variable holds the username value
      { email: email } // Assuming 'email' variable holds the email value
    ]
  })

  if (!user) {
    throw new ApiError(404, "user does not exist")

  }


  //password check
  const isPasswordValid = await user.isPasswordCorrect(password)


  if (!isPasswordValid) {
    throw new ApiError(401, "invalid password")
  }

   
  //access and refresh token generation
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  // send cookies to user


  //now we dont have access to refreshtoken in line 162 cause that time refreshtoken was empty so we need to call db or we can update current user so we have two option choice is ours
  const loggedUser = await User.findById(user._id).
    select("-password -redfreshToken")


  // without options cookies can be modified from frontend also so we are using options httponly so only server side it can be modified

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.
    status(200).
    cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser, accessToken,
          refreshToken
        },
        "user logged in successfully"
      )
    )
})

//main logic is to clear cookies from server and also refreshToken
const loggOutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      },
    },
    {
      new: true
    }

  )
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "user loggedout successfully"))

})

const refreshAccessToken=asyncHandler(async (req,res)=>{
  const  incomingRefreshToken=  req.cookie.refreshToken || req.body.refreshToken 

    if(!incomingRefreshToken){
      throw new ApiError(401,"invalid request , cant find refreshtoken ")
    }
   try {
     
     const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
     const user = await jwt.findById(decodedToken?._id)
 
     if(!user){
       throw new ApiError(401,"invalid request user not found")
     }
    
     if(incomingRefreshToken !== user?.refreshToken){
       throw new ApiError(401,"refresh token doesnot matches")
     }
     
    const { accessToken,newRefreshToken}= generateAccessAndRefreshToken(user._id)
 
     const options = {
       httpOnly :true,
       secure : true 
     }
 
     return res.
     cookie("accessToken",accessToken,options).
     cookie("refreshToken",newRefreshToken,options).
     json(
       ApiResponse(
         200,
           {accessToken,refreshToken:newRefreshToken},
           "access token refreshed"
       )
 
     )
   } catch (error) {

    throw new ApiError(401,error?.message||" something went worng in refreshAccessToken controller")
    
   }
    


  }
)
export { registerUser, loginUser, loggOutUser, refreshAccessToken }