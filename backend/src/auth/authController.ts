import { Request, Response } from "express";
import authService from "./authService";

const authController = {
  login: async (req: Request, res: Response)  => {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 2 // 2 hours to expire the cookie
      })
      res.status(200).json('user logged')
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },
};

export default authController;
