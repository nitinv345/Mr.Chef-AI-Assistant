import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mr_chef";

async function checkUser() {
  console.log("Connecting to:", mongoUri);
  try {
    await mongoose.connect(mongoUri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
    
    const UserSchema = new mongoose.Schema({ email: String }, { strict: false });
    const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

    const emailToCheck = "sudam456@gmail.com";
    const user = await UserModel.findOne({ email: emailToCheck });
    
    if (user) {
      console.log(`✅ User found: ${emailToCheck}`);
      console.log(user);
    } else {
      console.log(`❌ User NOT found: ${emailToCheck}`);
    }

    // Also check all users to see what's there
    const allUsers = await UserModel.find({}, { email: 1 });
    console.log("Current Users in DB:");
    allUsers.forEach(u => console.log(`- ${u.email}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Operation failed:", err);
    process.exit(1);
  }
}

checkUser();
