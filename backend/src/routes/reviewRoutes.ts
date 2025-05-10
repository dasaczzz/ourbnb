import { Router } from 'express'
import reviewController from '../controllers/reviewController'

const router = Router()

router.post('/reviews', reviewController.createReview)
router.get('/reviewsByPost/:post_id', reviewController.getReviewsByPostId)
router.get('/reviewsByUser/:user_id', reviewController.getReviewsByUserId)
router.delete('/reviews/:id', reviewController.deleteReviewById)
router.put('/reviews/:id', reviewController.updateReviewById)

export default router
