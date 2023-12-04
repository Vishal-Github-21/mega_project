
// wrapper function so that we can use as util throught the project
// approach of promises

const asyncHandler =  (requestHandler)=>{
     (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
     }
}


export {asyncHandler}









// const asyncHandler = () => {}
// const asyncHandler = (fn) => {}//writing higher order function
// const asyncHandler = (fn)=> {async ()=>{}}
// const asyncHandler = (fn)=> async ()=>{}// equivalent to previous line



// wrapper function so that we can use as util throught the project
// approach of try and catch
// const asyncHandler = (fn)=> async (req,res,next)=>{

//     try {
//         await fn(req,res,next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message:err.message
//         })
//     }
// } 