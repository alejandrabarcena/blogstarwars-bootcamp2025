import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token or user not found.'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (jwtError) {
        // Token is invalid, but we continue without user
        console.log('Invalid token in optional auth:', jwtError.message);
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue without authentication
  }
};