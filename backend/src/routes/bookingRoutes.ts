import { Router } from "express";
import bookingController from "../controllers/bookingController";

const router = Router();

router.post("/bookings", bookingController.createBooking);

export default router;
