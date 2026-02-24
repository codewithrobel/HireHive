import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { getOTPTemplate } from '../utils/emailTemplates.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.isVerified) {
                // Allow re-registering if unverified
                await User.deleteOne({ email });
            } else {
                res.status(400);
                throw new Error('User already exists');
            }
        }

        user = await User.create({
            name,
            email,
            password,
            role: role || 'seeker',
            isVerified: false
        });

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpires = Date.now() + 30 * 1000; // 30 seconds
            await user.save();

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Verify your email - HireHive',
                    message: `Your verification OTP is ${otp}. It will expire in 30 seconds.`,
                    html: getOTPTemplate(otp, 'verification')
                });
            } catch (err) {
                console.error("Email sending failed", err);
            }

            res.status(201).json({
                message: 'Registration successful. Please verify your email with the OTP sent to your inbox.',
                email: user.email
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                res.status(403);
                throw new Error('NOT_VERIFIED'); // Used to trigger React redirect
            }
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                skills: user.skills,
                resumeOriginalName: user.resumeOriginalName,
                experience: user.experience,
                profileInfo: user.profileInfo,
                profilePicture: user.profilePicture,
                socialLinks: user.socialLinks,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.skills) {
                user.skills = Array.isArray(req.body.skills)
                    ? req.body.skills
                    : req.body.skills.split(',').map(s => s.trim());
            }

            user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
            user.profileInfo = req.body.profileInfo !== undefined ? req.body.profileInfo : user.profileInfo;

            if (req.body.socialLinks) {
                try {
                    const links = typeof req.body.socialLinks === 'string' ? JSON.parse(req.body.socialLinks) : req.body.socialLinks;
                    user.socialLinks = { ...user.socialLinks, ...links };
                } catch (e) {
                    console.error("Error parsing socialLinks", e);
                }
            }

            if (req.file) {
                user.profilePicture = `/uploads/${req.file.filename}`;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                skills: updatedUser.skills,
                resumeOriginalName: updatedUser.resumeOriginalName,
                experience: updatedUser.experience,
                profileInfo: updatedUser.profileInfo,
                profilePicture: updatedUser.profilePicture,
                socialLinks: updatedUser.socialLinks,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Upload user resume
// @route   POST /api/auth/resume
// @access  Private
const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload a file');
        }

        const user = await User.findById(req.user._id);

        if (user) {
            user.resumeUrl = `/uploads/${req.file.filename}`;
            user.resumeOriginalName = req.file.originalname;

            const updatedUser = await user.save();

            res.json({
                message: 'Resume uploaded successfully',
                resumeUrl: updatedUser.resumeUrl,
                resumeOriginalName: updatedUser.resumeOriginalName
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.isVerified) {
            res.status(400);
            throw new Error('User is already verified');
        }

        if (user.otp !== otp) {
            res.status(400);
            throw new Error('Invalid OTP');
        }

        if (user.otpExpires < Date.now()) {
            res.status(400);
            throw new Error('OTP has expired');
        }

        // Mark as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.isVerified) {
            res.status(400);
            throw new Error('User is already verified');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 30 * 1000; // 30 seconds
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your email - HireHive',
                message: `Your new verification OTP is ${otp}. It will expire in 30 seconds.`
            });
        } catch (err) {
            console.error("Email sending failed", err);
        }

        res.status(200).json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error('User with this email does not exist');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 30 * 1000; // 30 seconds
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP - HireHive',
                message: `Your password reset OTP is ${otp}. It will expire in 30 seconds.`
            });
        } catch (err) {
            console.error("Email sending failed", err);
        }

        res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.otp !== otp) {
            res.status(400);
            throw new Error('Invalid OTP');
        }

        if (user.otpExpires < Date.now()) {
            res.status(400);
            throw new Error('OTP has expired');
        }

        // Update password and clear OTP
        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;
        // Also verify if not already verified
        user.isVerified = true;

        await user.save();

        res.status(200).json({ message: 'Password reset successfully. You can now login.' });
    } catch (error) {
        next(error);
    }
};

export { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, uploadResume, verifyOTP, resendOTP, forgotPassword, resetPassword };
