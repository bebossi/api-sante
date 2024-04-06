import EntityValidator from '@domain/@shared/entity-validator'
import { Product } from '@domain/product/entity/product/product'
import { ProductValidator } from '@domain/product/validators/product.validator'

export default class ProductValidatorFactory {
  static create(): EntityValidator<Product> {
    return new ProductValidator()
  }
}
