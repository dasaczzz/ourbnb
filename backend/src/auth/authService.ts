import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ClientSingleton } from "../lib/prisma";
import config from "../lib/config";

const prisma = ClientSingleton.getInstance()

const SECRET = config.jwt_secret;
if (!SECRET) {
  throw new Error("JWT secret is undefined");
}

const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const user = await prisma.user.findUnique({ where: { email } })

    // Verifica si el usuario existe
    if (!user) throw new Error("El usuario o la contraseña son incorrectas");

    // Verifica si la contraseña es correcta
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("El usuario o la contraseña son incorrectas");

    // Si los datos son correctos, genera el JWT
    if (user.id && user.email) {
      const token = jwt.sign(
        { id: user.id },
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
