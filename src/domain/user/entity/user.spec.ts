import UserValidatorFactory from '../factories/validators/user-validator.factory'
import { UserId } from '../value-objects/user-id'
import { User } from './user'

describe('User entity unit tests', () => {
  const mockUserValidator = { validate: jest.fn() }
  UserValidatorFactory.create = jest.fn().mockReturnValue(mockUserValidator)

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should create a User with default properties', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret',
      role: 'user',
    })

    expect(user.id).toBeInstanceOf(UserId)
    expect(user.name).toEqual('John Doe')
    expect(user.email).toEqual('john@example.com')
    expect(user.role).toEqual('user')
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
  })

  it('should create a User with specific properties', () => {
    const createdAt = new Date()
    const updatedAt = new Date()
    const userId = new UserId()

    const user = new User({
      id: userId,
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
      role: 'admin',
      createdAt,
      updatedAt,
    })

    expect(user.id).toEqual(userId)
    expect(user.createdAt).toEqual(createdAt)
    expect(user.updatedAt).toEqual(updatedAt)
  })

  it('should validate user properties', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret',
      role: 'user',
    })

    user.validate()

    expect(mockUserValidator.validate).toHaveBeenCalledWith(user)
  })

  it('should create and validate a user', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret',
      role: 'user',
    }

    const user = User.create(userData)

    expect(user).toBeInstanceOf(User)
    expect(mockUserValidator.validate).toHaveBeenCalledWith(user)
  })

  it('should convert user properties to JSON', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret',
      role: 'user',
    })

    const json = user.toJSON()

    expect(json).toEqual({
      id: user.id.value,
      email: user.email,
      name: user.name,
      role: user.role,
      orders: user.orders,
      addressess: user.addressess,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  })
})
