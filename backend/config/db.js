import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        if (!process.env.MONGO_URI) {
            console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables!');
            process.exit(1);
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.log('Ensure your MongoDB Atlas connection string is correct and your IP is whitelisted (or access allowed from anywhere).');
        process.exit(1);
    }
};

export default connectDB;
