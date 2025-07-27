import jwt from 'jsonwebtoken';

export const generateAccessToken=(user)=>{
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
}

export const generateRefreshToken=(user)=>{
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export const verifyToken=(token)=>{
    return jwt.verify(token, process.env.JWT_SECRET);
}