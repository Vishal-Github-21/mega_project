import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

//to handle uploads from user we use multer
import {upload} from "../middlewares/multer.middleware.js"

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
// router.route("/login").post(loginUser)//not written til now

export default router