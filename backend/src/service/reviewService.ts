import { Review } from "@prisma/client";
import { ClientSingleton } from "../lib/prisma";
import { pipeline } from "stream";

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

    getReviewsByPostId: async (post_id: string): Promise<any> => {
        return await prisma.review.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        post_id: post_id
                    }
                },
                {
                    $lookup: {
                        from: "User",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        comment: 1,
                        qualification: 1,
                        date_review: 1,
                        user_id: 1,
                        post_id: 1,
                        user: {
                            name: 1,
                            profilepic: 1
                        }
                    }
                }
            ]
        });
    },

    getReviewsByUserId: async (user_id: string): Promise<Review[]> => {
        return await prisma.review.findMany({
            where: {
                user_id: user_id
            },
        });
    },

    updateReviewById: async (id: string, data: Partial<CreateReviewInput>): Promise<Review> => {
        try {
            const updateData: Partial<CreateReviewInput> = {};
            if (data.comment !== undefined) updateData.comment = data.comment;
            if (data.date_review !== undefined) updateData.date_review = data.date_review;
            if (data.qualification !== undefined) updateData.qualification = data.qualification;
            if (data.user_id !== undefined) updateData.user_id = data.user_id;
            if (data.post_id !== undefined) updateData.post_id = data.post_id;

            const updatedReview = await prisma.review.update({
                where: { id },
                data: updateData,
            });
            return updatedReview;
        } catch (error: any) {
            console.error("Error en updateReviewById:", error);
            throw error;
        }
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
    },
}

export default reviewService;