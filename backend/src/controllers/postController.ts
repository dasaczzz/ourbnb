import { Request, Response } from "express";
import postService from "../service/postService";


const postController = {
  // crear publication
  createPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const newPublication = await postService.createPost(req.body);
      res.status(201).json(newPublication);
    } catch (error: any) {
      res.status(500).json({ error: "Error creando publicacion", details: error.message });
    }
  },
  
  // get all posts 
  getAllPosts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { city, country, minPrice, maxPrice } = req.query;

      // Convert minPrice and maxPrice to numbers if they exist
      const min = minPrice ? Number(minPrice) : undefined;
      const max = maxPrice ? Number(maxPrice) : undefined;

      const filters = {
        city: city ? String(city) : undefined,
        country: country ? String(country) : undefined,
        minPrice: min,
        maxPrice: max,
      };

      const posts = await postService.getAllPosts(filters);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: "Error obteniendo publicaciones", details: error.message });
    }
  },

  //get post by id
  getPostById: async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await postService.getPostById(req.params.id);
      res.json(post);
    } catch(error: any) {
      res.status(500).json({ error: "Error obteniendo la publicación", details: error.message });
    }
  },

  // get posts by user id
  getPostsByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const userPosts = await postService.getPostsByUserId(req.params.user_id);
      res.json(userPosts);
    } catch(error: any) {
      res.status(500).json({ error: "Error obteniendo las publicaciones del usuario", details: error.message });
    }
  },

  //delete post by id 
  deletePostById: async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedPost = await postService.deletePostById(req.params.id);
      res.status(200).json({ message: "Publicación eliminada correctamente", deletedPost });
    } catch(error: any) {
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

  // search posts by query in title or description
  searchPosts: async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.query as string;
      if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
      }
      const posts = await postService.searchPosts(query);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: "Error buscando publicaciones", details: error.message });
    }
  },
};

export default postController;

