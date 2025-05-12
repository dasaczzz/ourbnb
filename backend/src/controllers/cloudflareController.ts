import { Request, Response } from "express";
import * as userService from '../service/userService'
import postService from "../service/postService";
import multer from "multer";
import { uploadImageToR2 } from "../service/cloudflareService";

const upload = multer();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const cloudflareController = {
  uploadProfilePic: async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No se subió ningún archivo" });
        return;
      }

      const fileBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;

      const originalName = req.file.originalname;
      const extension = originalName.substring(originalName.lastIndexOf('.')) || '';
      const filename = `${req.params.id}${extension}`;
      console.log("Nombre de archivo usado para subir:", filename);

      const urlPublica = await uploadImageToR2(fileBuffer, filename, mimeType);
      const updatedUser = await userService.updateUserById(req.params.id, { profilepic: urlPublica } as any);

      res.status(200).json({ message: "Foto de perfil actualizada", user: updatedUser });
    } catch (error: any) {
      console.error("Error subiendo foto de perfil:", error);
      res.status(500).json({ error: "Error subiendo foto de perfil", details: error.message });
    }
  },

  uploadNewPostImage: async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No se subió ningún archivo" });
        return;
      }

      const fileBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;

      const originalName = req.file.originalname;
      const extension = originalName.substring(originalName.lastIndexOf('.')) || '';
      const filename = `${req.params.id}${extension}`;
      console.log("Nombre de archivo usado para subir publicación:", filename);

      const urlPublica = await uploadImageToR2(fileBuffer, filename, mimeType);

      // Fetch existing post to get current images
      const existingPost = await postService.getPostById(req.params.id);
      if (!existingPost) {
        res.status(404).json({ error: "Publicación no encontrada" });
        return;
      }

      // Append new image URL to existing images array
      const updatedImages = existingPost.images ? [...existingPost.images, urlPublica] : [urlPublica];

      const updatedPost = await postService.updatePostById(req.params.id, {
        images: updatedImages,
      });

      res.status(200).json({ message: "Imagen de publicación actualizada", publication: updatedPost });
    } catch (error: any) {
      console.error("Error subiendo imagen de publicación:", error);
      res.status(500).json({ error: "Error subiendo imagen de publicación", details: error.message });
    }
  },
}

export default cloudflareController;
