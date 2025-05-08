import { Router } from "express";
import bookingController from "../controllers/bookingController";

const router = Router();

router.post("/bookings", bookingController.createBooking);
router.get("/bookings", bookingController.getAllBookings);
router.get("/bookings/:id", bookingController.getBookingById);
router.delete("/bookings/:id", bookingController.deleteBookingById);

export default router;
