import { Router } from "express";
import facilityController from "../controllers/facilityController";

const router = Router();

router.get("/facilities/:post_id", facilityController.getFacilitiesByPostId);

export default router; 