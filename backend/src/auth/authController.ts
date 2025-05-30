import { Request, Response } from "express";
import authService from "./authService";
import { getUserById } from "../service/userService";

const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);
      
      const token = await authService.login(email, password);
      console.log('Login successful, setting token cookie');
      
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 2, // 2 hours to expire the cookie
        path: '/'
      })
      console.log('Cookie set successfully');
      res.status(200).json('user logged')
    } catch (error: any) {
      console.log('Login failed:', error.message);
      res.status(401).json({ error: error.message });
    }
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    console.log('Logout request received');
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    })
    console.log('Cookie cleared successfully');
    res.status(200).json('logout exitoso')
  },

  verifyCookie: async(req: Request, res: Response): Promise<void> => {
    const userId = (req as any).id
    console.log('Verifying cookie for user:', userId);

    try {
      const user = await getUserById(userId)
      if (!user) {
        console.log('User not found:', userId);
        res.status(404).json({ error: 'Usuario no encontrado' })
        return
      }
      console.log('User found:', user);
      res.status(200).json({ user })
    } catch (err) {
      console.log('Error verifying cookie:', err);
      res.status(500).json({ error: 'Error del servidor' })
    }
  }
};

export default authController;
