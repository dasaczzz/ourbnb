import { Request, Response } from 'express'
import * as usuariosService from '../service/userService'
import { hashPassword } from '../lib/utils'

export const createUser = async (req: Request, res: Response) => {
  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword
  console.log(req.body.password)
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
  try {
    const deletedUser = await usuariosService.deleteUserById(req.params.id)
    res.json(deletedUser)

  } catch(error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'error deleting user', details: error.message })
    }
  }
}

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const updatedUser = await usuariosService.updateUserById(req.params.id, req.body)
    res.json(updatedUser)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'error updating user', details: error.message })
    }
  }
}
