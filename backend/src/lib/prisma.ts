import { PrismaClient } from '@prisma/client'

export class ClientSingleton {
  
  private static prisma: PrismaClient

  private constructor() {

  }

  public static getInstance() {
    if(!ClientSingleton.prisma) {
      ClientSingleton.prisma = new PrismaClient()
    }

    return ClientSingleton.prisma
  }

}
