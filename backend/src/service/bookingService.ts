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

  getBookingsByUserId: async(user_id: string): Promise<Booking []> => {
    return await prisma.booking.findMany({
      where: {
        users: {
          has: user_id,
        },
      },
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
  },
  
  validateUsersForBooking: async (data: { users: string[] }) => {
    const usersInDb = await prisma.user.findMany({
      where: { 
        email: { in: data.users }
      },
      select: {
        id: true,
        email: true
      }
    });

    const foundEmails = usersInDb.map(user => user.email);
    const missingEmails = data.users.filter(email => !foundEmails.includes(email));

    if (missingEmails.length > 0) {
      throw new Error(`Los siguientes emails no existen en la base de datos: ${missingEmails.join(', ')}`);
    }

    // retorna los IDs de los usuarios para la reserva
    return usersInDb.map(user => user.id);
  }


};

export default bookingService;