import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mr_chef";

async function inspectIndexes() {
  console.log("Connecting to:", mongoUri);
  try {
    await mongoose.connect(mongoUri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
    
    const db = mongoose.connection.db;
    if (!db) {
      console.error("No database found");
      process.exit(1);
    }
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    if (collections.find(c => c.name === 'users')) {
      const indexes = await db.collection('users').indexes();
      console.log("Indexes for 'users' collection:");
      console.log(JSON.stringify(indexes, null, 2));

      // Also check a sample document
      const sample = await db.collection('users').findOne({});
      console.log("Sample document from 'users':");
      console.log(sample);
    } else {
      console.log("Collection 'users' not found");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Operation failed:", err);
    process.exit(1);
  }
}

inspectIndexes();
