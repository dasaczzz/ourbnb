import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ClientSingleton } from "../lib/prisma";
import config from "../lib/config";

export interface UserLogged {
  id: string
  email: string
  name: string
  phone: string | null
  profilepick: string | null
  token: string
}

const prisma = ClientSingleton.getInstance()

const SECRET = config.jwt_secret;
if (!SECRET) {
  throw new Error("JWT secret is undefined");
}

const authService = {
  login: async (email: string, password: string): Promise<UserLogged> => {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user)

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
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profilepick: user.profilepick,
        token: token
      };
    } else {
      throw new Error("Usuario sin ID o email válido");
    }
  },
};

export default authService;
