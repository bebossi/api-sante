import { IUserRepository } from '@domain/user/repository/user.repository.interface'
import { UserRepository } from 'infra/account/prisma/repository/user.repository'
import { container } from 'tsyringe'

container.registerSingleton<IUserRepository>('IUserRepository', UserRepository)
