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
    }
}

export default reviewService;