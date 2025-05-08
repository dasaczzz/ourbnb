import { Request, Response } from "express";
import { UserLogged } from "./authService";
import authService from "./authService";

const authController = {
  login: async (req: Request, res: Response)  => {
    try {
      const { email, password } = req.body;
      const userInfo = await authService.login(email, password);
      const data = await res.json(userInfo);
      return data
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },
};

export default authController;
