import { UserId } from '@domain/user/value-objects/user-id'
import { prisma } from '../../../../@config/prisma'
import { User } from '../../../../domain/user/entity/user'
import {
  IUserRepository,
  LoginInput,
} from '../../../../domain/user/repository/user.repository.interface'
import { UserMapper } from './mappers/user-mapper'
import Address from '@domain/user/entity/address'

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

  async login({ email, password }: LoginInput): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        AND: [{ email }, { password }],
      },
    })
    if (user) return true
    return false
  }

  async findById(userId: string | UserId): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId instanceof UserId ? userId.value : userId,
      },
      include: {
        addresses: true,
        orders: true,
      },
    })
    if (!user) return null

    return UserMapper.toEntity(user)
  }

  async createAddress(inputAddress: Address): Promise<void> {
    await prisma.address.create({
      data: {
        zip: inputAddress.zip,
        neighborhood: inputAddress.neighborhood,
        street: inputAddress.street,
        street_number: inputAddress.streetNumber,
        complement_number: inputAddress.complementNumber,
        user_id: inputAddress.userId.toString(),
      },
    })
  }
}
