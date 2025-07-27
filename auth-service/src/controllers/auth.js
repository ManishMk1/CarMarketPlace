import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new UserModel({ email, password: hash });
  await user.save();
  res.status(201).json({ message: "User registered" });
};

export const login = async (req, res) => {
  console.log(' Login request received:', req.body,Date.now());
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user._id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.json({ accessToken, refreshToken });
};
