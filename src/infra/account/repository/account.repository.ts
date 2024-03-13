import { prisma } from '../../../@config/prisma'
import { IAccountRepository } from '../../../domain/account/repository/account.repository.interface'

export class AccountRepository implements IAccountRepository {
  async create(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<void> {
    const accountCreated = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
      include: {
        addresses: true,
        orders: true,
      },
    })
  }
}
