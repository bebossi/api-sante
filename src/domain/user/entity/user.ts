import { Order } from 'domain/order/entity/order'
import UserValidatorFactory from '../factories/validators/user-validator.factory'
import { UserId } from '../value-objects/user-id'
import Address from './address'
import { AggregateRoot } from '@domain/@shared/aggegate-root'
import NotificationError from '@domain/@shared/notification/notification-error'

export type UserProps = {
  id: UserId
  name: string
  email: string
  password: string
  role: string
  addressess: Address[]
  orders: Order[]
  createdAt: Date
  updatedAt: Date
}

export type UserConstructorProps = {
  id?: UserId | string
  name: string
  email: string
  password: string
  role: string
  createdAt?: Date
  updatedAt?: Date
  // addressess: Address[]
  // orders: Order[]
}

class User extends AggregateRoot {
  _props: UserProps = {} as UserProps
  constructor(props: UserConstructorProps) {
    super()
    this._props.id =
      typeof props.id === 'string' ? new UserId(props.id) : props.id ?? new UserId()

    this._id = this._props.id

    this._props.name = props.name
    this._props.email = props.email
    this._props.password = props.password
    this._props.role = props.role
    this._props.createdAt = props.createdAt ? new Date(props.createdAt) : new Date()
    this._props.updatedAt = props.updatedAt
      ? new Date(props.updatedAt)
      : this._props.createdAt
  }

  public static create(input: UserConstructorProps): User {
    const user = new User(input)
    user.validate()
    return user
  }

  get id() {
    return this._props.id
  }
  get email() {
    return this._props.email
  }
  get password() {
    return this._props.password
  }
  get name() {
    return this._props.name
  }
  get role() {
    return this._props.role
  }
  get orders() {
    return this._props.orders
  }

  get addressess() {
    return this._props.addressess
  }
  get createdAt() {
    return this._props.createdAt
  }
  get updatedAt() {
    return this._props.updatedAt
  }

  public validate() {
    UserValidatorFactory.create().validate(this)
    if (this._notification.hasErrors()) {
      throw new NotificationError(this._notification.getErrors())
    }
  }

  toJSON() {
    return {
      id: this._props.id.value,
      email: this._props.email,
      name: this._props.name,
      role: this._props.role,
      orders: this._props.orders,
      addressess: this._props.addressess,
      createdAt: this._props.createdAt?.toISOString(),
      updatedAt: this._props.updatedAt?.toISOString(),
    }
  }
}

export { User }
