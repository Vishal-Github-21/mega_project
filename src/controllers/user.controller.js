//main logic building starts here
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/apierrors.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponses.js"


//logic to register user
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //       message:"ok"
  //   })


  //get user deatails from frontend✅
  //validation - not empty and many more✅
  //check if user already exists: username,email ✅
  //check for images,check for avatar✅
  //upload them to cloudinary,avatar✅
  //create user object - create entry in db {as mongodb is nosql db}✅
  //remove password and refresh token field from response (because we are sending to frontend)✅
  // check for user creation✅
  //return res✅

  const { fullName, email, username, password } = req.body
  console.log("email", email);

  //beginer code
  //  if(fullName==""){
  //   throw new ApiError{400,"fullname is required"}
  //  }


  // checks if user has entered empty string
  if (
    [fullName, email, username, password].some((field) =>
      field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  //validation
  const existedUser = User.findOne({

    $or: [{ username }, { email }]

  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists ")
  }


  const avatarlocalPath = req.files?.avatar[0]?.path //getting the path of the avatar uploaded by multer
  const coverImageLocalPath = req.files?.coverImage[0]?.path;



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
    new ApiResponse(200,createdUser,"User registred successfully")
   )


})


export { registerUser }