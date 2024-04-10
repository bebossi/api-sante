import EntityValidator from '@domain/@shared/entity-validator'
import { Topping } from '@domain/product/entity/topping/topping'
import { ToppingValidator } from '@domain/product/validators/topping.validator'

export default class ToppingValidatorFactory {
  static create(): EntityValidator<Topping> {
    return new ToppingValidator()
  }
}
