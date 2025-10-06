import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  passwordHash: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true,
  versionKey: false
});

export default mongoose.model("User", userSchema);