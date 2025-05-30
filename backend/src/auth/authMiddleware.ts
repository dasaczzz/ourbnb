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
  const token = req.cookies?.token

  if (!token) {
    res.status(401).json({ error: "Token requerido" })
    return
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload
    // add the id to the request
    ;(req as any).id = String(decoded.id)
    next()
  } catch (err) {
    res.status(403).json({ error: "Token inválido" })
  }
}

export default authMiddleware