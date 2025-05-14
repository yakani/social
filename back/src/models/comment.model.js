import mongoose from "mongoose";
 const commentSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true,
    },
    path:{
        type:String,
        default:null
    },
    content:{
        type: String,
        default: null,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
 },{
    timestamps: true,
 });
 const Comment = mongoose.model('Comment',commentSchema);
 export  default Comment ;