import mongoose from "mongoose";
import bcrypt from "bcrypt"; // For hashing passwords

//we can save the password credentials in the database using the user controller after the saving user details in users details database.
const UserCredentialSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      ref: "User", // Reference to the User model
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
UserCredentialSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserCredentialSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserCredential = mongoose.model("UserCredential", UserCredentialSchema);

export default UserCredential;
