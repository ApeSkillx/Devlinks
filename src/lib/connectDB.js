import mongoose from "mongoose";

const connection = {};

export default async function connectDB() {
  if (connection.isConnected) { // If already connected, no need to connect again :)
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || '', {});
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
