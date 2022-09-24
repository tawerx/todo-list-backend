import mongoose from 'mongoose';

const Notes = new mongoose.Schema({
  value: { type: String, unique: true, required: true },
  date: { type: String, required: true },
  user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model('Notes', Notes);
