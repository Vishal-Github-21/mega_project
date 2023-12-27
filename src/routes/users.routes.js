import { Router } from "express";
import { changePassword,
        getCurrentUser,
        getUserChannelProfile,
        getWatchHistory,
        loggOutUser, 
        loginUser, 
        refreshAccessToken, 
        registerUser, 
        updateAccountDetails,
        updateUserAvatar,
        updateUserCoverImage} from "../controllers/user.controller.js";

//to handle uploads from user we use multer
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(
   
    //upload is a middleware we are using
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )

//login route

router.route("/login").post(loginUser)


//secured routes

router.route("/logout").post(verifyJWT,loggOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/getUser-details").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)

export default router