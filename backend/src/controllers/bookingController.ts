import { Request, Response } from "express";
import bookingService from "../service/bookingService";

const bookingController = {
  // crear reservacion
  createBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const newBooking = await bookingService.createBooking(req.body);
      res.status(201).json(newBooking);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Error creando reserva', details: error.message });
    }
  },
};

export default bookingController;
