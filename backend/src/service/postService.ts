import { Post } from "@prisma/client";
import { ClientSingleton } from "../lib/prisma";

interface PublicationData {
  publicacionId?: string;
  usuarioId: string;
  titulo: string;
  descripcion: string;
  ubicacion?: {
    city: string;
    country: string;
    location: string;
  };
  precioNoche?: number;
  imagenes?: string[];
}

const prisma = ClientSingleton.getInstance()

const postService = {
  createPost: async (data: PublicationData): Promise<Post> => {
    if (!data.usuarioId) {
      throw new Error("usuarioId is required");
    }
    const createData: any = {
      title: data.titulo,
      description: data.descripcion,
      night_cost: data.precioNoche ? data.precioNoche.toString() : undefined,
      images: data.imagenes || [],
      user_id: data.usuarioId,
    };
    if (data.ubicacion) {
      createData.location = {
        set: data.ubicacion,
      };
    }
    console.log("Creando publicacion con los datos = ", createData);
    return await prisma.post.create({
      data: createData,
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

  updatePostById: async (id: string, data: Partial<PublicationData>): Promise<Post> => {
    try {
      const updateData: any = {};
      if (data.titulo !== undefined) updateData.title = data.titulo;
      if (data.descripcion !== undefined) updateData.description = data.descripcion;
      if (data.ubicacion !== undefined) {
        updateData.location = {
          set: data.ubicacion,
        };
      }
      if (data.precioNoche !== undefined) updateData.night_cost = data.precioNoche.toString();
      if (data.imagenes !== undefined) updateData.images = data.imagenes;
      if (data.usuarioId !== undefined) updateData.user_id = data.usuarioId;

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
