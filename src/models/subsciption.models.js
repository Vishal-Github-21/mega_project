import mongoose ,{Schema} from "mongoose";

const subsciptionSchema = new Schema(
    {
      subscriber :{// one who is subscribing
        type : Schema.Types.ObjectId,
        ref : "User"
      } ,
      channel :{// to whom subscribing
        type : Schema.Types.ObjectId,
        ref : "User"
      }   
    },{
        timestamps : true
    }
)

export  const Subsciption=mongoose.model("Subsciption",subsciptionSchema) 