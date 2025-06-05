import mongoose from 'mongoose';
const followerSchema = new mongoose.Schema({
    Author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    Follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
},{timestamps: true});
const Followers = mongoose.model('Follower', followerSchema);
export default Followers;