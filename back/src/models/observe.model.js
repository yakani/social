import mongoose from 'mongoose';

const observeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'File'}
  ],
  saves:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'File'}
  ],
  dislikes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  createdAt: { type: Date, default: Date.now }
},{timestamps: true});

const Observe = mongoose.model('Observe', observeSchema);

export default Observe;
