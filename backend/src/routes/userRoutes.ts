import { Router } from 'express'
import * as usuariosController from '../controllers/userController'
import authMiddleware from '../auth/authMiddleware'
import multer from 'multer'

const router = Router()
const upload = multer()

router.post('/users', usuariosController.createUser)
router.get('/users', usuariosController.getAllUsers)
router.get('/user', authMiddleware, usuariosController.getUserById)
router.put('/users/:id', authMiddleware, upload.single('profilepic'), usuariosController.updateUserById)
router.delete('/users/:id', authMiddleware, usuariosController.deleteUserById)

export default router