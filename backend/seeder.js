import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@hirehive.com' });

        if (adminExists) {
            console.log('Admin user already exists! Deleting to recreate...');
            await User.deleteOne({ email: 'admin@hirehive.com' });
        }

        const adminUser = await User.create({
            name: 'HireHive Admin',
            email: 'admin@hirehive.com',
            password: 'AdminPassword123!', // <-- Pass RAW string, Mongoose pre('save') hashes it
            role: 'admin',
            isVerified: true,
            skills: ['Platform Management', 'Administration']
        });

        // Verify the hash matched
        const directCheck = await bcrypt.compare('AdminPassword123!', adminUser.password);
        console.log(`Hash check successful? ${directCheck}`);

        console.log(`Admin User Created Successfully!`);
        console.log(`Email: ${adminUser.email}`);
        console.log(`Password: AdminPassword123!`);
        console.log(`Role: ${adminUser.role}`);
        process.exit();

    } catch (error) {
        console.error(`Error configuring Admin user: ${error}`);
        process.exit(1);
    }
};

seedAdmin();
