import * as yup from 'yup'
import EntityValidator from '../../@shared/entity-validator'
import { Category } from '../entity/category/category'

class CategoryValidator implements EntityValidator<Category> {
  validate(entity: Category): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required('ID is required'),
          name: yup.string().required('Name is required'),
        })
        .validateSync(
          {
            id: entity.id,
            name: entity.name,
          },
          {
            abortEarly: false,
          }
        )
    } catch (errors) {
      const e = errors as yup.ValidationError
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: 'category',
          message: error,
        })
      })
    }
  }
}

export { CategoryValidator }
