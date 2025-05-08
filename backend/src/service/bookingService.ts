import { Booking } from "@prisma/client";
import { ClientSingleton } from "../lib/prisma";

const prisma = ClientSingleton.getInstance();

type CreateBookingInput = Parameters<typeof prisma.booking.create>[0]['data'];

const bookingService = {
  createBooking: async (data: CreateBookingInput): Promise<Booking> => {
    if (!data.post_id) {
      throw new Error("el post_id es requerido");
    }
    console.log("Creando reserva con los datos = ", data);
    return await prisma.booking.create({
      data: data,
    });
  },

  getAllBookings: async(): Promise<Booking []> => {
    return await prisma.booking.findMany();
  },

  getBookingById: async(id: string): Promise<Booking | null> => {
    return await prisma.booking.findUnique({
      where: {
        id: id,
      }
    });
  },

  deleteBookingById: async(id: string): Promise<Booking> => {
    try {
      const deleted = await prisma.booking.delete({
        where: {
          id: id,
        },
      });
      return deleted;
    } catch (error) {
      console.error("Error en deleteBookingById:", error);
      throw error;
    }
  }
};

export default bookingService;
