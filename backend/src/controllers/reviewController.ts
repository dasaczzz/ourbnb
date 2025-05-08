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
}
}

export default reviewController;