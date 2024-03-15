import * as yup from 'yup'
import { User } from '../entity/user'
import EntityValidator from '../../@shared/entity-validator'

class UserValidator implements EntityValidator<User> {
  validate(entity: User): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required('ID is required'),
          email: yup.string().required('User email is required'),
          name: yup.string().required('Name is required'),
          password: yup.string().required('Password is required'),
          role: yup.string().required().default('guest'),
          createdAt: yup.date().required('User creation date is required'),
          updatedAt: yup.date().required('User last update date is required'),
        })
        .validateSync(
          {
            id: entity.id,
            email: entity.email,
            name: entity.name,
            password: entity.password,
            role: entity.role,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
          },
          {
            abortEarly: false,
          }
        )
    } catch (errors) {
      const e = errors as yup.ValidationError
      console.log(e)
    }
  }
}

export { UserValidator }
