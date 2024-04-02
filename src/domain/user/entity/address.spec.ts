import { UserId } from '../value-objects/user-id'
import Address from './address'

describe('Address entity', () => {
  describe('constructor and getters', () => {
    const userId = new UserId()
    const addressProps = {
      street: '123 Main St',
      streetNumber: 456,
      neighborhood: 'Downtown',
      city: 'Metropolis',
      complementNumber: 78,
      zip: '12345',
      userId: userId.value,
    }
    it('should create an Address with given properties', () => {
      const address = new Address(addressProps)

      expect(address.street).toEqual('123 Main St')
      expect(address.streetNumber).toEqual(456)
      expect(address.neighborhood).toEqual('Downtown')
      expect(address.city).toEqual('Metropolis')
      expect(address.zip).toEqual('12345')
      expect(address.userId).toEqual(userId.value)
    })

    it('should handle UserId objects', () => {
      const userId = new UserId()
      const address = new Address({ ...addressProps, userId })

      expect(address.userId).toBe(userId)
    })
  })

  describe('validate', () => {
    it('should throw an error if a required field is missing', () => {
      const invalidAddressProps = {
        street: '',
        streetNumber: 0,
        neighborhood: '',
        city: '',
        zip: '',
        complementNumber: 0,
        userId: '',
      }

      expect(() => new Address(invalidAddressProps)).toThrow('Street is required')
      expect(
        () => new Address({ ...invalidAddressProps, street: '123 Main St' })
      ).toThrow('Number is required')
    })
  })

  describe('create', () => {
    it('should create and validate an address', () => {
      const addressProps = {
        street: '123 Main St',
        streetNumber: 456,
        neighborhood: 'Downtown',
        city: 'Metropolis',
        complementNumber: 78,
        zip: '12345',
        userId: 'user-123',
      }

      const address = Address.create(addressProps)

      expect(address).toBeInstanceOf(Address)
    })
  })

  describe('toString', () => {
    it('should return a string representation of the address', () => {
      const addressProps = {
        street: '123 Main St',
        streetNumber: 456,
        neighborhood: 'Downtown',
        city: 'Metropolis',
        complementNumber: 78,
        zip: '12345',
        userId: 'user-123',
      }
      const address = new Address(addressProps)

      const addressString = address.toString()

      expect(addressString).toEqual(
        '123 Main St,Downtown 456, apartment 78 12345, Metropolis'
      )
    })
  })
})
