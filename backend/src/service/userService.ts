import { ClientSingleton} from '../lib/prisma'
import bcrypt from "bcryptjs";

type CreateUserInput = Parameters<typeof prisma.user.create>[0]['data'];

const prisma = ClientSingleton.getInstance()

export const createUser = async (data: CreateUserInput) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })
  if (existingUser) {
    throw new Error('El correo electrónico ya está registrado')
  }
  return await prisma.user.create({data})
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

export const updateUserById = async (id: string, data: Partial<CreateUserInput>) => {
  try {
    const updateData = { ...data };
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updateData.password = hashedPassword;
    }
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error en updateUserById:", error);
    throw error;
  }
}