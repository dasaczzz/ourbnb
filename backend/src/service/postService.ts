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

  getAllPosts: async (filters?: { city?: string; country?: string; minPrice?: number; maxPrice?: number }): Promise<Post[]> => {
    const { city, country, minPrice, maxPrice } = filters || {};

    // Build MongoDB query object
    const query: any = {};

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (country) {
      query['location.country'] = { $regex: country, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.night_cost = {};
      if (minPrice !== undefined) {
        query.night_cost.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.night_cost.$lte = maxPrice;
      }
    }

    // Use $and if both city and country filters exist
    let finalQuery = query;
    if (city && country) {
      finalQuery = { $and: [{ 'location.city': { $regex: city, $options: 'i' } }, { 'location.country': { $regex: country, $options: 'i' } }] };
      if (minPrice !== undefined || maxPrice !== undefined) {
        finalQuery.$and.push({ night_cost: query.night_cost });
      }
    } else if ((city || country) && (minPrice !== undefined || maxPrice !== undefined)) {
      finalQuery = { $and: [query] };
    }

    const whereClause: any = {};

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.night_cost = {};
      if (minPrice !== undefined) {
        whereClause.night_cost.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.night_cost.lte = maxPrice;
      }
    }

    return await prisma.post.findMany({
      where: whereClause,
    });
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

  searchPosts: async (query: string): Promise<Post[]> => {
    return await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  },
};

export default postService;
