import { Request, Response } from "express";
import authService from "./authService";
import { getUserById } from "../service/userService";

const authController = {
  login: async (req: Request, res: Response)  => {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 2, // 2 hours to expire the cookie
        path: '/'
      })
      res.status(200).json('user logged')
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },

  logout: async (req: Request, res: Response) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })
    res.status(200).json('logout exitoso')
  },

  verifyCookie: async(req: Request, res: Response) => {
    const userId = (req as any).id

    try {
      const user = getUserById(userId)
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.status(200).json({ user })
    } catch (err) {
      res.status(500).json({ error: 'Error del servidor' })
    }
  }
};

export default authController;
