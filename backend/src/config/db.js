import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the MONGO_URI environment variable.
 * Exits the process with code 1 on failure to prevent the server
 * from running in a broken, database-less state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
