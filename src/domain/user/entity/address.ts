import { UserId } from '@domain/user/value-objects/user-id'
import { Order } from '../../order/entity/order'
import { UserProps } from './user'

export type AddressProps = {
  // id: string
  street: string
  neighborhood: string
  city: string
  streetNumber: number
  complementNumber?: number
  zip: string
  userId: UserId | string
  // user: UserProps
}
export default class Address {
  _street: string = ''
  _city: string = ''
  _neighborhood: string
  _streetNumber: number
  _complementNumber: number | undefined
  _zip: string
  _userId: string | UserId

  constructor(props: AddressProps) {
    this._street = props.street
    this._streetNumber = props.streetNumber
    this._neighborhood = props.neighborhood
    this._complementNumber = props.complementNumber ?? undefined
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
  get complementNumber(): number | undefined {
    return this._complementNumber || undefined
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
    const requiredFields = {
      street: this._street,
      streetNumber: this._streetNumber,
      neighborhood: this._neighborhood,
      city: this._city,
      zip: this._zip,
      userId: this._userId,
    }

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value === null || value === undefined || value === '' || value === 0) {
        throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`)
      }
    }
  }

  toString() {
    return `${this._street},${this._neighborhood} ${this._streetNumber}, ${
      this._complementNumber && `apartment ${this._complementNumber}`
    } ${this._zip}, ${this._city}`
  }
}
