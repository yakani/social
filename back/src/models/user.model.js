import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
       
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    avatar:{
        type: String,
        default: '/avatar.png',
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    googleId:{
        type: String,
        default: "",
    },
},{
    timestamps: true,
});

userSchema.pre('save',async function(next){
	if(!this.isModified('password')){
		return next();  
     }
	const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});
userSchema.methods.matchPasswords = async function (params) {
    try {

	return await bcrypt.compare(params,this.password);
}catch (error) {
    throw new Error('Password comparison failed');
    }
}
const User = mongoose.model('User',userSchema);
export  default User;
