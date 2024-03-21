import { prisma } from '../../../../@config/prisma'
import { User } from '../../../../domain/user/entity/user'
import { IUserRepository } from '../../../../domain/user/repository/user.repository.interface'
import { UserMapper } from './mappers/user-mapper'

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<void> {
    const userFormatted = UserMapper.toPrisma(user)
    await prisma.user.create({
      data: { ...userFormatted },
      include: {
        addresses: true,
        orders: true,
      },
    })
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    if (!user) return null

    return UserMapper.toEntity(user)
  }
}
