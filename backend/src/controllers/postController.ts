import { Request, Response } from "express";
import postService from "../service/postService";

const postController = {
  // crear publication
  createPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const newPublication = await postService.createPost(req.body);
      res.status(201).json(newPublication);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error creando publicacion", details: error.message });
    }
  },
  
  // get all posts 
  getAllPosts: async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await postService.getAllPosts();
      res.json(posts);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error obteniendo publicaciones", details: error.message });
    }
  },

  //get post by id
  getPostById: async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await postService.getPostById(req.params.id);
      res.json(post);
    } catch(error: any) {
      console.error(error);
      res.status(500).json({ error: "Error obteniendo la publicación", details: error.message });
    }
  },

  //delete post by id 
  deletePostById: async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedPost = await postService.deletePostById(req.params.id);
      res.status(200).json({ message: "Publicación eliminada correctamente", deletedPost });
    } catch(error: any) {
      console.error(error);
      res.status(500).json({ error: "Error eliminando la publicación", details: error.message });
    }
  },

  //update post by id
  updatePostById: async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedPost = await postService.updatePostById(req.params.id, req.body);
      res.status(200).json(updatedPost);
    } catch (error: any) {
      console.error("Error en updatePostById:", error);
      res.status(500).json({ error: "Error actualizando publicación", details: error.message });
    }
  },
};

export default postController;
