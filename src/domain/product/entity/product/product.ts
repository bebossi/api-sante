import { AggregateRoot } from '@domain/@shared/aggegate-root'
import ProductValidatorFactory from '../../factories/validators/product-validator.factory'
import { ProductId } from '../../value-objects/product-id'
import { Category } from '../category/category'
import { ToppingModel } from '../topping'
import NotificationError from '@domain/@shared/notification/notification-error'
import { CategoryId } from '@domain/product/value-objects/category-id'

export type ProductProps = {
  id: ProductId
  name: string
  description: string
  price: number
  image: string
  categoryId: CategoryId
  category: Category
  toppings: ToppingModel[] | []
  createdAt: Date
  updatedAt: Date
}
export type ProductConstructorProps = {
  id?: ProductId | string
  name: string
  description: string
  price: number
  image: string
  categoryId: CategoryId | string
  toppings: ToppingModel[] | []
  updatedAt?: any
  createdAt?: string | number | Date
}

class Product extends AggregateRoot {
  _props: ProductProps = {} as ProductProps
  constructor(props: ProductConstructorProps) {
    super()
    this._props.id =
      typeof props.id === 'string' ? new ProductId(props.id) : props.id ?? new ProductId()
    this._id = this._props.id
    this._props.name = props.name
    this._props.description = props.description
    this._props.price = props.price
    this._props.image = props.image
    this._props.categoryId =
      typeof props.categoryId === 'string'
        ? new CategoryId(props.categoryId)
        : props.categoryId ?? new CategoryId()
    this._props.toppings = props.toppings || []
    this._props.createdAt = props.createdAt ? new Date(props.createdAt) : new Date()
    this._props.updatedAt = props.updatedAt
      ? new Date(props.updatedAt)
      : this._props.createdAt
  }

  public static create(input: ProductConstructorProps): Product {
    const product = new Product(input)
    product.validate()
    return product
  }

  public validate() {
    ProductValidatorFactory.create().validate(this)
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
  get description() {
    return this._props.description
  }

  get price() {
    return this._props.price
  }
  get image() {
    return this._props.image
  }

  get toppings() {
    return this._props.toppings
  }
  get categoryId() {
    return this._props.categoryId
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
      description: this._props.description,
      price: this._props.price,
      image: this._props.image,
      toppings: this._props.toppings,
      categoryId: this._props.categoryId,
      createdAt: this._props.createdAt.toISOString(),
      updatedAt: this._props.updatedAt.toISOString(),
    }
  }
}

export { Product }
