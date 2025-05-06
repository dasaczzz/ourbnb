import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "secreto123";

const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const user = await prisma.user.findUnique({ where: { email } });

    // Verifica si el usuario existe
    if (!user) throw new Error("Usuario no encontrado");

    // Verifica si la contraseña es correcta
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Contraseña incorrecta");

    // Si los datos son correctos, genera el JWT
    if (user.id && user.email) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET,
        { expiresIn: "2h" }
      );
      return token;
    } else {
      throw new Error("Usuario sin ID o email válido");
    }
  },
};

export default authService;
