import mongoose from 'mongoose';
const connectDB = async () => {
    try {
    mongoose.connect(process.env.MONGO_URI);
   const db = mongoose.connection;
      // console.log('MongoDB connected');
      console.log('MongoDB connected');
    return db;
    } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1);
    }
  };

  export default connectDB
