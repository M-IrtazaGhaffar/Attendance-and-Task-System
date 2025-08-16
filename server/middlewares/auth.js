import { verifyToken } from '../utils/jsonwebtoken.js';

// Role-based access middleware
export function roleBasedAccess(allowedRoles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Authorization token is required' });

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) return res.status(401).json({ message: 'Invalid or expired token' });
    if (!allowedRoles.includes(decoded.role)) return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });


    req.user = decoded; // Attach user payload to the request object
    next(); // Proceed to the next middleware or route handler
  };
}
