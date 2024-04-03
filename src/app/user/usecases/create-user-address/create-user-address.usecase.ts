import Address from '@domain/user/entity/address'
import { UserNotFoundError } from '@domain/user/errors/user-not-found-error'
import { IUserRepository } from '@domain/user/repository/user.repository.interface'
import { UserId } from '@domain/user/value-objects/user-id'
import { inject, injectable } from 'tsyringe'

export interface CreateUserAddressUsecaseInput {
  userId: string | UserId
  street: string
  neighborhood: string
  city: string
  streetNumber: number
  complementNumber?: number
  zip: string
}
export interface ICreateUserUsecases {
  execute(input: CreateUserAddressUsecaseInput): Promise<void>
}
@injectable()
export class CreateUserAddressUsecase implements ICreateUserUsecases {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}
  async execute(input: CreateUserAddressUsecaseInput): Promise<void> {
    const { city, complementNumber, neighborhood, street, streetNumber, userId, zip } =
      input

    const user = await this.userRepository.findById(userId)
    if (!user) throw new UserNotFoundError()

    const address = Address.create({
      city,
      complementNumber,
      neighborhood,
      street,
      streetNumber,
      userId,
      zip,
    })
    await this.userRepository.createAddress(address)
  }
}
