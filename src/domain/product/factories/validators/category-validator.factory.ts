import EntityValidator from '@domain/@shared/entity-validator'
import { Category } from '@domain/product/entity/category/category'
import { CategoryValidator } from '@domain/product/validators/category.validator'

export default class CategoryValidatorFactory {
  static create(): EntityValidator<Category> {
    return new CategoryValidator()
  }
}
