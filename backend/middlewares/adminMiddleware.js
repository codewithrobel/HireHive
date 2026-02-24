import asyncHandler from 'express-async-handler';

export const isAdmin = asyncHandler(async (req, res, next) => {
    // Assuming the 'protect' middleware has run before this, so req.user exists
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
});
