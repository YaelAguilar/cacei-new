import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Buscar token en cookies primero, luego en headers de autorización
  let token = req.cookies.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remover "Bearer " del inicio
    }
  }

  if (!token) {
    res.status(401).json({
      errors: [{
        status: "401",
        title: "Unauthorized",
        detail: "No token provided"
      }]
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    console.log("Token decoded:", decoded);
    next();
  } catch (error) {
    res.status(401).json({
      errors: [{
        status: "401",
        title: "Unauthorized",
        detail: "Invalid token"
      }]
    });
    return;
  }
}