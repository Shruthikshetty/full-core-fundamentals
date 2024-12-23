import mongoose, { Schema } from "mongoose";

//define the user schema
const UserSchema = new Schema({
  name: {
    type: mongoose.Schema.Types.String,
    require: true,
    unique: true,
  },
  displayName: mongoose.Schema.Types.String,
  password: {
    type: mongoose.Schema.Types.String,
    require: true,
  },
});

//comppile into a model

export const User = mongoose.model("User", UserSchema);
