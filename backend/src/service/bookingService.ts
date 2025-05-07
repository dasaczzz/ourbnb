import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ReservationData {
  users: string[]; // array of user IDs
  post_id: string;
  init_date: Date | string;
  end_date: Date | string;
  service_cost: number;
  total_cost: number;
}

const bookingService = {
  createBooking: async (data: ReservationData) => {
    const createData = {
      users: data.users,
      post_id: data.post_id,
      init_date: data.init_date,
      end_date: data.end_date,
      service_cost: data.service_cost,
      total_cost: data.total_cost,
    };
    console.log("Creando reserva con los datos = ", createData);
    return await prisma.booking.create({
      data: createData,
    });
  },
};

export default bookingService;
