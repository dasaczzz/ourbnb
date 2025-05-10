import { Post } from "@prisma/client";
import { ClientSingleton } from "../lib/prisma";

const prisma = ClientSingleton.getInstance();

type CreatePostInput = Parameters<typeof prisma.post.create>[0]['data'];

const postService = {
  createPost: async (data: CreatePostInput): Promise<Post> => {
    if (!data.user_id) {
      throw new Error("el user_id es requerido");
    }
    console.log("Creando publicacion con los datos = ", data);
    return await prisma.post.create({
      data: data,
    });
  },

  getAllPosts: async (): Promise<Post[]> => {
    return await prisma.post.findMany();
  },

  getPostById: async (id: string): Promise<Post | null> => {
    return await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  },

  getPostsByUserId: async (user_id: string): Promise<Post[]> => {
    return await prisma.post.findMany({
      where: {
        user_id: user_id,
      },
    });
  },

  deletePostById: async (id: string): Promise<Post> => {
    try {
      const deleted = await prisma.post.delete({
        where: {
          id: id,
        },
      });
      return deleted;
    } catch (error) {
      console.error("Error en deletePostById:", error);
      throw error;
    }
  },

  updatePostById: async (id: string, data: Partial<CreatePostInput>): Promise<Post> => {
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.location !== undefined) {
        updateData.location = {
          set: data.location,
        };
      }
      if (data.night_cost !== undefined) updateData.night_cost = data.night_cost;
      if (data.images !== undefined) updateData.images = data.images;
      if (data.user_id !== undefined) updateData.user_id = data.user_id;

      const updatedPost = await prisma.post.update({
        where: { id: id },
        data: updateData,
      });
      return updatedPost;
    } catch (error) {
      console.error("Error en updatePostById:", error);
      throw error;
    }
  },
};

export default postService;
