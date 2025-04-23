require("dotenv").config();
const mongoose=require("mongoose");


mongoose.connect(process.env.URL_DB)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));



const UserSchema = new mongoose.Schema({
    name: String,
    google_id: String,
    email: String,
    password: String
});


const User=mongoose.model("User",UserSchema);
module.exports=User;