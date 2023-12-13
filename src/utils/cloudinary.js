import {v2 as cloudinary} from "cloudinary";
import exp from "constants";
import fs from "fs";


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (locslFilePath)=>{
    try {
        
        if(!locslFilePath) return null;
        //upload the file
       const response= await cloudinary.uploader.upload(locslFilePath,{
            resource_type:"auto"//finding type of resource like png jpeg video    
        })
        //file has been uploaded successfully
        // console.log("file is uploaded on cloudinary: ",response.url)

        fs.unlinkSync(locslFilePath)//removing file from local disk
        return response
    } catch (error) {
        // of not uploaded we remove the locally saved temporary file as upload operation got failed

        fs.unlinkSync(locslFilePath)
    }
}


export {uploadOnCloudinary}




