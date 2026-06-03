import mongoose from 'mongoose';
const urlSchema=mongoose.Schema({
        userId:{
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
           required: true
        },
        originalUrl:{
            type:String,
            required:true
        },
        shortCode:{
            type:String
        },
        clicks:{
          type:Number,
          default:0
        },
},
{timestamps:true},

);
const Url=mongoose.model("Url",urlSchema);
export default Url;