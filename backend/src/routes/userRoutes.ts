import { Router } from 'express'
import * as usuariosController from '../controllers/userController'
import authMiddleware from '../auth/authMiddleware'

const router = Router()

router.post('/users', usuariosController.createUser)
router.get('/users', usuariosController.getAllUsers)
router.get('/user', authMiddleware, usuariosController.getUserById)
router.put('/users/:id', usuariosController.updateUserById)
router.delete('/users/:id', usuariosController.deleteUserById)

export default router
