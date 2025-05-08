import { Router } from 'express'
import * as usuariosController from '../controllers/userController'

const router = Router()

router.post('/users', usuariosController.createUser)
router.get('/users', usuariosController.getAllUsers)
router.get('/users/:id', usuariosController.getUserById)
router.delete('/users/:id', usuariosController.deleteUserById)

export default router
