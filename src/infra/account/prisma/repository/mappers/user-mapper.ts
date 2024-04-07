import { User as PrismaUser } from '@prisma/client'
import { User } from '@domain/user/entity/user'

class UserMapper {
  public static toPrisma(user: User) {
    const map = {
      id: user.id.value,
      name: user.name,
      password: user.password,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }

    return map
  }

  public static toEntity(input: PrismaUser): User {
    const user = User.create({
      id: input.id,
      email: input.email!,
      password: input.password!,
      name: input.name!,
      role: input.role,
      createdAt: input.created_at,
      updatedAt: input.updated_at,
    })

    return user
  }
}

export { UserMapper }
