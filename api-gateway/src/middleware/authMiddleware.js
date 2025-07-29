import jwt from 'jsonwebtoken';
import Logger from '../logs/logger.js';
const logger = new Logger('authMiddleware');

export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err){
       logger.error('Authentication error:', err);
       return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; 
    next();
  });
}
