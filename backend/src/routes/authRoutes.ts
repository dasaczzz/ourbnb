import { Router } from 'express'
import authController from '../auth/authController'

const router = Router()

router.post('/login', authController.login)
router.post('/logout', authController.logout)

export default router
