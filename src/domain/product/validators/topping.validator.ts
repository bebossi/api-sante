import * as yup from 'yup'
import EntityValidator from '../../@shared/entity-validator'
import { Topping } from '../entity/topping/topping'

class ToppingValidator implements EntityValidator<Topping> {
  validate(entity: Topping): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required('ID is required'),
          name: yup.string().required('Name is required'),
          description: yup.string().required('Description is required'),
          price: yup.number().required('Price is required'),
          productId: yup.string().required('Product Id is required'),
          image: yup.string(),
        })
        .validateSync(
          {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            image: entity.image,
            productId: entity.productId,
          },
          {
            abortEarly: false,
          }
        )
    } catch (errors) {
      const e = errors as yup.ValidationError
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: 'topping',
          message: error,
        })
      })
    }
  }
}

export { ToppingValidator }
