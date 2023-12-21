import { Router } from "express";
import { loggOutUser, loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";

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


export default router