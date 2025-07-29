import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
  const { email, password } = req.body;
  const existingUser=await UserModel.findOne({email});
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = new UserModel({ email, password: hash });
  await user.save();
  res.status(201).json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user._id, email: user.email };
  const accessToken = generateAccessToken(payload);
 res.cookie('accessToken', accessToken, {
  httpOnly: true,           // prevent JS access
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',          // or 'None' if using cross-domain with HTTPS
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});

res.cookie('userInfo', JSON.stringify({ email: user.email, id: user._id }), {
  httpOnly: false,          // so frontend can read it (optional)
  sameSite: 'Lax',
  maxAge: 24 * 60 * 60 * 1000
});
  res.json({ accessToken, email: user.email });
};

export const profile = async (req,res)=>{
  const token = req.cookies?.accessToken;
  const data=await jwt.verify(token, process.env.JWT_SECRET)
  const { email } = data;
  const user = await UserModel.findOne({email}).select('-password');
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}
