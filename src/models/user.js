import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true
  },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  profile_picture: { type: String },
  profile_picture_publicId: { type: String },
  devlinksList: [{
    id: { type: String },
    platform: { type: String },
    link: { type: String },
  }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;