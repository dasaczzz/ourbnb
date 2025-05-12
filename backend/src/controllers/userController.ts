import { Request, Response } from 'express'
import * as usuariosService from '../service/userService'
import { hashPassword } from '../lib/utils'
import { uploadImageToR2 } from '../service/cloudflareService'

export const createUser = async (req: Request, res: Response) => {
  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword
  try {
    const newUser = await usuariosService.createUser(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'error creating user', details: error.message })
    }
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await usuariosService.getAllUsers()
    res.json(users)

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'error getting users', details: error.message })
    }
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id
    const user = await usuariosService.getUserById(userId)
    res.json(user)

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'error getting user', details: error.message })
    }
  }
}

export const deleteUserById = async (req: Request, res: Response) => {
  const userIdFromToken = (req as any).id;
  const userIdFromParams = req.params.id;

  if (userIdFromToken !== userIdFromParams) {
    res.status(403).json({ error: 'No tienes permiso para eliminar este usuario' });
    return;
  }

  try {
    const deletedUser = await usuariosService.deleteUserById(userIdFromParams);
    res.json(deletedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'error deleting user', details: error.message });
    }
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const userIdFromToken = (req as any).id;
  const userIdFromParams = req.params.id;

  if (userIdFromToken !== userIdFromParams) {
    res.status(403).json({ error: 'No tienes permiso para editar este usuario' });
    return;
  }
  try {
    const updateData: any = req.body || {}

    if (req.file) {
      const imageUrl = await uploadImageToR2(req.file.buffer, req.file.originalname, req.file.mimetype)
      updateData.profilepic = imageUrl
    }

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password)
    }

    const updatedUser = await usuariosService.updateUserById(userIdFromParams, updateData);
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'error updating user', details: error.message });
    }
  }
};