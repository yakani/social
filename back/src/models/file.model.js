import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    path:{
        type: String,
        default: null,
    },
    thumbnail:{
        type: String,
        default: null,
    },
    title:{
        type: String,
        default:""
    },
    prompt:{
        type: String,
        default:""
    },
    mediaId:{
        type:String,
        default:null
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
},{
    timestamps: true,
});
const File = mongoose.model('File', fileSchema);
export default File;