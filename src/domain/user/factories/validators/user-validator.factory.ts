import EntityValidator from '../../../@shared/entity-validator'
import { User } from '../../entity/user'
import { UserValidator } from '../../validators/user.validator'

export default class UserValidatorFactory {
  static create(): EntityValidator<User> {
    return new UserValidator()
  }
}
