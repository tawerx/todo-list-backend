import mongoose from 'mongoose';

const NewNotes = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  dateCreate: { type: String },
  files: { type: Array },
  complete: { type: Boolean },
  delay: { type: Boolean },
  user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model('NewNotes', NewNotes);
