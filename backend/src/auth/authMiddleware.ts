import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto123";

interface JwtPayload {
  id: number;
  email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    (req as any).user = decoded; // puedes definir una interfaz extendida para Request si prefieres evitar el `any`
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
  }
};

export default authMiddleware;
