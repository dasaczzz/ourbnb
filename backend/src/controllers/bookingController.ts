import { Request, Response } from "express";
import bookingService from "../service/bookingService";

const bookingController = {
  // crear booking
  createBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const newBooking = await bookingService.createBooking(req.body);
      res.status(201).json(newBooking);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Error creando reserva', details: error.message });
    }
  },
  
  //get all bookings
  getAllBookings: async (req: Request, res: Response): Promise<void> => {
    try {
      const bookings = await bookingService.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error obteniendo reservaciones", details: error.message });
    }
  },

  //get booking por id
  getBookingById: async (req: Request, res: Response): Promise<void> => {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.json(booking);
    } catch(error: any) {
      console.error(error);
      res.status(500).json({ error: "Error obteniendo reservacion", details: error.message });
    }
  },

  getBookingsByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const userBookings = await bookingService.getBookingsByUserId(req.params.user_id);
      res.json(userBookings);
    } catch(error: any) {
      console.error(error);
      res.status(500).json({ error: "Error obteniendo reservaciones del usuario", details: error.message });
    }
  },

  //delete booking by id
  deleteBookingById: async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedBooking = await bookingService.deleteBookingById(req.params.id);
      res.json(deletedBooking);
    } catch(error: any) {
      console.error(error);
      res.status(500).json({ error: "Error eliminando reservacion", details: error.message });
    }
  },

  //validate users for booking
  validateUsersForBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingUsers = await bookingService.validateUsersForBooking(req.body);
      res.json(bookingUsers);
    } catch(error:any) {
      console.error(error);
      res.status(500).json({ error: "Error validando usuarios para la reservacion", details: error.message });
    }
  }

};

export default bookingController;
