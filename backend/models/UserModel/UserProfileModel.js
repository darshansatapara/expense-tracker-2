import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profilePic: {
    type: String,
    required: false,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // password: {
  //   type: String,
  //   required: true,
  // },
  mobile_no: {
    type: String,
    required: true,
    unique: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  profile_complated: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("UserProfile", userSchema);
export default User;
