import { Router } from 'express'
import authController from '../auth/authController'
import authMiddleware from '../auth/authMiddleware'

const router = Router()

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/verify', authMiddleware, authController.verifyCookie)

export default router
