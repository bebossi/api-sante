import { FakeUsersRepository } from '@domain/user/repository/fake/fake-user-repository'
import { CreateUserAddressUsecase } from './create-user-address.usecase'
import { CreateUserUsecase } from '../create-user/create-user.usecases'
import { User } from '@domain/user/entity/user'
import Address from '@domain/user/entity/address'
import { UserNotFoundError } from '@domain/user/errors/user-not-found-error'
import { UserId } from '@domain/user/value-objects/user-id'

describe('CreateUserAddressUsecase unit tests', () => {
  let usersRepository: FakeUsersRepository
  let addressUsecase: CreateUserAddressUsecase

  const user = User.create({
    name: 'bernardo',
    email: 'be@gmail.com',
    password: 'test',
    role: 'admin',
  })

  beforeEach(async () => {
    usersRepository = new FakeUsersRepository()
    addressUsecase = new CreateUserAddressUsecase(usersRepository)
  })

  it('should a new address', async () => {
    const createAddressSpy = jest.spyOn(usersRepository, 'createAddress')

    usersRepository.create(user)

    const arrange = {
      userId: user.id.value,
      zip: '12345',
      street: 'Main St',
      neighborhood: 'Downtown',
      city: 'Metropolis',
      streetNumber: 101,
      complementNumber: 102,
    }
    const address = new Address(arrange)

    await addressUsecase.execute(address)

    const createdAddress = usersRepository.addressess.find(
      (a) => a.userId === user.id.value
    )
    expect(createdAddress).toBeDefined()
    expect(createdAddress?.city).toEqual('Metropolis')
    expect(createAddressSpy).toHaveBeenCalled()
  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    const addressData = {
      userId: new UserId().value,
      zip: '12345',
      street: 'Main St',
      neighborhood: 'Downtown',
      city: 'Metropolis',
      streetNumber: 101,
      complementNumber: 102,
    }

    await expect(addressUsecase.execute(addressData)).rejects.toThrow(UserNotFoundError)
  })

  it('should handle optional complementNumber correctly', async () => {
    const user = User.create({
      name: 'bernardo',
      email: 'be@gmail.com',
      password: 'test',
      role: 'admin',
    })
    await usersRepository.create(user)

    const addressData = {
      userId: user.id.value,
      zip: '12345',
      street: 'Main St',
      neighborhood: 'Downtown',
      city: 'Metropolis',
      streetNumber: 101,
      complementNumber: undefined,
    }

    await addressUsecase.execute(addressData)

    const createdAddress = usersRepository.addressess.find(
      (a) => a.userId === user.id.value
    )
    expect(createdAddress).toBeDefined()
    expect(createdAddress?.complementNumber).toBeUndefined()
  })
})
