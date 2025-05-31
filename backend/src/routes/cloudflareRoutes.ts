import { Router } from "express";
import multer from "multer";
import cloudflareController from "../controllers/cloudflareController";

const router = Router();
const upload = multer();

router.put("/cloudflare/users/:id/profilepick", upload.single("file"), cloudflareController.uploadProfilePic);
router.put("/cloudflare/posts/:id/images", upload.single("file"), cloudflareController.uploadNewPostImage);

export default router;
