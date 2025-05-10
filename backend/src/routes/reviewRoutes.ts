import { Router } from 'express'
import reviewController from '../controllers/reviewController'

const router = Router()

router.post('/reviews', reviewController.createReview)
router.get('/reviewsByPost/:post_id', reviewController.getReviewsByPostId)
router.delete('/reviews:id', reviewController.deleteReviewById)

export default router
