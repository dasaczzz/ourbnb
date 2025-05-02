import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'

type CreateUserInput = Parameters<typeof prisma.user.create>[0];

export const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create(data)
}

export const getAllUsers = async () => {
  return await prisma.user.findMany()
}

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  })
}

export const deleteUserById = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  })
}
