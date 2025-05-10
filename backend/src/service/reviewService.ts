import { Review } from "@prisma/client";
import { ClientSingleton } from "../lib/prisma";

const prisma = ClientSingleton.getInstance();

type CreateReviewInput = Parameters<typeof prisma.review.create>[0]['data'];

const reviewService = {
    createReview: async (data: CreateReviewInput): Promise<Review> => {
        if (!data.user_id) {
            throw new Error("el user_id es requerido");
        }
        if (!data.post_id) {
            throw new Error("el post_id es requerido");
        }
        return await prisma.review.create({
            data,
        })
    },

    getReviewsByPostId: async (post_id: string): Promise<Review[]> => {
        return await prisma.review.findMany({
            where: {
                post_id: post_id
            },
        });
    },

    deleteReviewById: async (id: string): Promise<Review> => {
        try {
            const deleted = await prisma.review.delete({
                where: {
                 id: id,
                },
            });
            return deleted;
        } catch (error: any) {
            console.error("Error en deleteReviewById:", error);
            throw error;
        }
    }
}

export default reviewService;