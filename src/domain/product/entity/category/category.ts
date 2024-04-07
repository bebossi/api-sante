import { AggregateRoot } from '@domain/@shared/aggegate-root'
import NotificationError from '@domain/@shared/notification/notification-error'
import CategoryValidatorFactory from '@domain/product/factories/validators/category-validator.factory'
import { CategoryId } from '@domain/product/value-objects/category-id'

export type CategoryProps = {
  id: CategoryId
  name: string
  createdAt: Date
  updatedAt: Date
}
export type CategoryConstructorProps = {
  id?: string | CategoryId
  name: string
  createdAt?: string
  updatedAt?: string
}

class Category extends AggregateRoot {
  _props: CategoryProps = {} as CategoryProps
  constructor(props: CategoryConstructorProps) {
    super()
    this._props.id =
      typeof props.id === 'string'
        ? new CategoryId(props.id)
        : props.id ?? new CategoryId()
    this._id = this._props.id
    this._props.name = props.name
    this._props.createdAt = props.createdAt ? new Date(props.createdAt) : new Date()
    this._props.updatedAt = props.updatedAt
      ? new Date(props.updatedAt)
      : this._props.createdAt
  }

  public static create(input: CategoryConstructorProps): Category {
    const product = new Category(input)
    product.validate()
    return product
  }

  public validate() {
    CategoryValidatorFactory.create().validate(this)
    if (this._notification.hasErrors()) {
      throw new NotificationError(this._notification.getErrors())
    }
  }
  get id() {
    return this._props.id
  }
  get name() {
    return this._props.name
  }

  get createdAt() {
    return this._props.createdAt
  }
  get updatedAt() {
    return this._props.updatedAt
  }
  toJSON() {
    return {
      id: this._props.id,
      name: this._props.name,
      createdAt: this._props.createdAt.toISOString(),
      updatedAt: this._props.updatedAt.toISOString(),
    }
  }
}

export { Category }
