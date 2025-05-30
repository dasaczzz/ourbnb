import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../lib/config";

const SECRET = config.jwt_secret;
if (!SECRET) {
  throw new Error("JWT not found");
}

interface JwtPayload {
  id: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Auth middleware - Headers:', req.headers);
  console.log('Auth middleware - Cookies:', req.cookies);
  
  const token = req.cookies?.token

  if (!token) {
    console.log('No token found in cookies');
    res.status(401).json({ error: "Token requerido" })
    return
  }

  try {
    console.log('Verifying token:', token);
    const decoded = jwt.verify(token, SECRET) as JwtPayload
    console.log('Token decoded:', decoded);
    
    if (!decoded.id) {
      console.log('Token decoded but no id found');
      res.status(401).json({ error: "Token inválido: ID no encontrado" })
      return
    }
    // add the id to the request
    ;(req as any).id = String(decoded.id)
    console.log('Token verified successfully, user id:', decoded.id);
    next()
  } catch (err) {
    console.log('Token verification failed:', err);
    res.status(403).json({ error: "Token inválido" })
  }
}

export default authMiddleware