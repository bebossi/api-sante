import { AggregateRoot } from '@domain/@shared/aggegate-root'
import NotificationError from '@domain/@shared/notification/notification-error'
import ToppingValidatorFactory from '@domain/product/factories/validators/topping-validator.factory'
import { ProductId } from '@domain/product/value-objects/product-id'
import { ToppingId } from '@domain/product/value-objects/topping-id'

export type ToppingProps = {
  id: ToppingId
  name: string
  productId: ProductId
  description: string
  price: number
  image: string
}

export type ToppingConstructorProps = {
  id?: string | ToppingId
  name: string
  productId: string | ProductId
  description: string
  price: number
  image: string
}

class Topping extends AggregateRoot {
  _props: ToppingProps = {} as ToppingProps

  constructor(props: ToppingConstructorProps) {
    super()
    this._props.id =
      typeof props.id === 'string' ? new ToppingId(props.id) : props.id ?? new ToppingId()
    this._id = this._props.id
    ;(this._props.name = props.name),
      (this._props.productId =
        typeof props.productId === 'string'
          ? new ProductId(props.productId)
          : props.productId ?? new ProductId()),
      (this._props.description = props.description),
      (this._props.price = props.price),
      (this._props.image = props.image)
  }

  public static create(input: ToppingConstructorProps): Topping {
    const topping = new Topping(input)
    topping.validate()
    return topping
  }

  public validate() {
    ToppingValidatorFactory.create().validate(this)
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

  get productId() {
    return this._props.productId
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

  toJSON() {
    return { ...this._props }
  }
}

export { Topping }
