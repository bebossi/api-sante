import { UserId } from '@domain/user/value-objects/user-id'
import { Order } from '../../order/entity/order'
import { UserProps } from './user'

export type AddressProps = {
  id: string
  street: string
  neighborhood: string
  city: string
  streetNumber: number
  complementNumber: number
  zip: string
  userId: UserId | string
  user: UserProps
}
export default class Address {
  _street: string = ''
  _city: string = ''
  _neighborhood: string
  _streetNumber: number
  _complementNumber: number
  _zip: string
  _userId: string | UserId

  constructor(props: AddressProps) {
    this._street = props.street
    this._streetNumber = props.streetNumber
    this._neighborhood = props.neighborhood
    this._complementNumber = props.complementNumber
    this._zip = props.zip
    this._city = props.city
    this._userId = props.userId

    this.validate()
  }

  public static create(input: AddressProps) {
    const address = new Address(input)
    address.validate()
    return address
  }

  get userId() {
    return this._userId
  }

  get street(): string {
    return this._street
  }

  get streetNumber(): number {
    return this._streetNumber
  }

  get zip(): string {
    return this._zip
  }

  get neighborhood(): string {
    return this._neighborhood
  }

  get city(): string {
    return this._city
  }

  validate() {
    if (this._street.length === 0) {
      throw new Error('Street is required')
    }
    if (this._streetNumber === 0) {
      throw new Error('Number is required')
    }
    if (!this._userId) {
      throw new Error('Number is required')
    }
    if (this._zip.length === 0) {
      throw new Error('Zip is required')
    }
    if (this._neighborhood.length === 0) {
      throw new Error('Neighborhood is required')
    }
    if (this._city.length === 0) {
      throw new Error('City is required')
    }
  }

  toString() {
    return `${this._street},${this._neighborhood} ${this._streetNumber}, ${
      this._complementNumber && `apartment ${this._complementNumber}`
    } ${this._zip}, ${this._city}`
  }
}
