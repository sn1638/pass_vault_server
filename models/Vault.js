import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  encryptedData: {
    type: String,
    required: true
  },

  iv: {
    type: String,
    required: true
  },

  salt: {
    type: String,
    required: true
  }
  
}, {
  timestamps: true,
  versionKey: false
});

vaultSchema.index({ userId: 1, title: 1 });

export default mongoose.model("Vault", vaultSchema);