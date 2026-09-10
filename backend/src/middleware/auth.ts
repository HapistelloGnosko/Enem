import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET_KEY = process.env.JWT_SECRET || 'enem-quest-secret-key-2024';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Faça login.' });
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY) as { userId: number };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão expirada ou token inválido.' });
  }
}
