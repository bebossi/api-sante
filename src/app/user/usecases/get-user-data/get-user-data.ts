import { Order } from '@domain/order/entity/order'
import Address from '@domain/user/entity/address'
import { UserNotFoundError } from '@domain/user/errors/user-not-found-error'
import { IUserRepository } from '@domain/user/repository/user.repository.interface'
import { inject, injectable } from 'tsyringe'

interface GetUserDataInput {
  userId: string
}

interface GetUserDataOutput {
  id: string
  email: string
  name: string
  role: string
  orders: Order[]
  addressess: Address[]
  createdAt: string
  updatedAt: string
}

@injectable()
class GetUserDataUsecase {
  constructor(
    @inject('UsersRepositoryInterface')
    private usersRepository: IUserRepository
  ) {}

  public async execute({ userId }: GetUserDataInput): Promise<GetUserDataOutput> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new UserNotFoundError()
    return { ...user.toJSON() }
  }
}

export { GetUserDataUsecase }
