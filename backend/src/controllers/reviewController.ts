import { Request, Response } from "express";
import reviewService from "../service/reviewService";
import postService from "../service/postService";

const reviewController = {
    //crear review
    createReview: async(req: Request, res: Response): Promise<void> => {
        try {
            const newReview = await reviewService.createReview(req.body);
            res.status(201).json(newReview);
        } catch(error: any) {
            res.status(500).json({message: error.message});
        }
    },

    // get reviews por id de post
    getReviewsByPostId: async (req: Request, res: Response): Promise<void> => {
        try {
            const postReviews = await reviewService.getReviewsByPostId(req.params.id);
            res.json(postReviews);
        } catch(error: any) {
            res.status(500).json({message: error.message});
        }
    },

    // get reviews por id de user
    getReviewsByUserId: async (req: Request, res: Response): Promise<void> => {
        try {
            const userReviews = await reviewService.getReviewsByUserId(req.params.id);
            res.json(userReviews);
        } catch(error: any) {
            res.status(500).json({message: error.message});
        }
    },

    // update review por id
    updateReviewById: async (req: Request, res: Response): Promise<void> => {
        try {
            const updatedReview = await reviewService.updateReviewById(req.params.id, req.body);
            res.json(updatedReview);
        } catch(error:any) {
            res.status(500).json({message: error.message});
        }
    },

    // delete review por id
    deleteReviewById: async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedReview = await reviewService.deleteReviewById(req.params.id);
            res.json(deletedReview);
        } catch(error: any) {
            res.status(500).json({message: error.message});
        }
    }
}

export default reviewController;