import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

const testAuth = async () => {
    try {
        console.log('--- Starting Auth Verification ---');

        // 1. Register User
        const registerData = {
            name: 'Verification Bot',
            email: `verify_${Date.now()}@example.com`,
            password: 'Password123!',
            role: 'seeker'
        };
        console.log(`Testing Registration with: ${registerData.email}...`);
        const regRes = await axios.post(`${BASE_URL}/auth/register`, registerData);
        console.log('✅ Registration Successful:', regRes.data.email);

        // 2. Login User
        const loginData = {
            email: registerData.email,
            password: 'Password123!'
        };
        console.log(`Testing Login with: ${loginData.email}...`);
        const logRes = await axios.post(`${BASE_URL}/auth/login`, loginData);
        console.log('✅ Login Successful:', logRes.data.email, 'Role:', logRes.data.role);

        // 3. Admin Login
        const adminData = {
            email: 'admin@hirehive.com',
            password: 'AdminPassword123!'
        };
        console.log('Testing Admin Login...');
        const adminRes = await axios.post(`${BASE_URL}/auth/login`, adminData);
        console.log('✅ Admin Login Successful:', adminRes.data.email, 'Role:', adminRes.data.role);

        console.log('--- Auth Verification Complete: ALL PASSED ---');
    } catch (error) {
        console.error('❌ Verification Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
        process.exit(1);
    }
};

testAuth();
