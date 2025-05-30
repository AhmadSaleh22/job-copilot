import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import type { MulterFile } from 'multer';
import dotenv from 'dotenv';
import { Multer } from 'multer';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  file?: Express.Multer.File; // Correct type for a file uploaded using Multer
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  console.log('[JWT_SECRET]', process.env.JWT_SECRET);
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}
