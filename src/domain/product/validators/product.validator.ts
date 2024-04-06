import * as yup from 'yup'
import EntityValidator from '../../@shared/entity-validator'
import { Product } from '../entity/product/product'

class ProductValidator implements EntityValidator<Product> {
  validate(entity: Product): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required('ID is required'),
          name: yup.string().required('Name is required'),
          description: yup.string().required('Description is required'),
          price: yup.number().required('Price is required'),
          categoryId: yup
            .string()
            .required('Category Id is required')
            .min(0, 'Price must be non-negative'),
          image: yup.string(),
          toppings: yup.array(),
          createdAt: yup.date().required('User creation date is required'),
          updatedAt: yup.date().required('User last update date is required'),
        })
        .validateSync(
          {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            image: entity.image,
            categoryId: entity.categoryId,
            toppings: entity.toppings,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
          },
          {
            abortEarly: false,
          }
        )
    } catch (errors) {
      const e = errors as yup.ValidationError
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: 'product',
          message: error,
        })
      })
    }
  }
}

export { ProductValidator }
