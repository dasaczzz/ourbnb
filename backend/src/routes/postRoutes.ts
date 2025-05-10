import { Router } from 'express'
import postController from '../controllers/postController'

const router = Router()

router.post('/posts', postController.createPost)
router.get('/posts', postController.getAllPosts)
router.get('/posts/:id', postController.getPostById)
router.get('/posts/:user_id', postController.getPostsByUserId)
router.delete('/posts/:id', postController.deletePostById)
router.put('/posts/:id', postController.updatePostById)

export default router
