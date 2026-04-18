// username — рядок, не обов’язкове поле, з параметром trim: true;
// email — рядок, унікальне, обов’язкове, з параметром trim: true;
// password — рядок, обов’язкове, мінімальна довжина — 8 символів.


import { Schema, model } from "mongoose";


const userSchema = new Schema({
  username: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  avatar: {
    type: String, required: false,
    default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
  },
},
{
  timestamps: true,
}
);

userSchema.pre("save", function () {
  if (!this.username) {
    this.username = this.email.split("@")[0];
  }
});

userSchema.methods.toJSON = function () {
  const object = this.toObject();
  delete object.password;
  return object;
};
export default model("User", userSchema);
