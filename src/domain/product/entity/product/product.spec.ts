import ProductValidatorFactory from '@domain/product/factories/validators/product-validator.factory'
import { Product, ProductConstructorProps } from './product'
import { ProductId } from '@domain/product/value-objects/product-id'

describe('Product entity', () => {
  const productProps = {
    id: new ProductId().value,
    name: 'Pizza Margherita',
    description: 'A delicious tomato and cheese pizza',
    price: 9.99,
    image: 'image-url',
    categoryId: 'rehntrjntyjtyj',
    // toppings: [new ToppingModel({ id: '1', name: 'Cheese' })],
    toppings: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create a product with provided properties', () => {
    const product = new Product(productProps)

    expect(product.id.value).toBe(productProps.id)
    expect(product.name).toBe(productProps.name)
    expect(product.description).toBe(productProps.description)
    expect(product.price).toBe(productProps.price)
    expect(product.image).toBe(productProps.image)
    expect(product.categoryId).toBe(productProps.categoryId)
    expect(product.toppings).toBe(productProps.toppings)
    expect(product.createdAt.toISOString()).toBe(productProps.createdAt.toISOString())
    expect(product.updatedAt.toISOString()).toBe(productProps.updatedAt.toISOString())
  })

  it('should create a product and call validate method', () => {
    jest.spyOn(ProductValidatorFactory, 'create').mockReturnValue({
      validate: jest.fn(),
    })
    const product = Product.create(productProps)

    expect(ProductValidatorFactory.create).toHaveBeenCalled()
    expect(product).toBeInstanceOf(Product)
  })

  it('should validate the product entity', () => {
    jest.spyOn(ProductValidatorFactory, 'create').mockReturnValue({
      validate: jest.fn(),
    })
    const product = new Product(productProps)
    product.validate()

    const validator = ProductValidatorFactory.create()
    expect(validator.validate).toHaveBeenCalledWith(product)
  })

  it('should throw validation error if name is missing', () => {
    const invalidProductProps: Partial<ProductConstructorProps> = {
      id: new ProductId().value,
      // name: undefined,
      description: 'A delicious tomato and cheese pizza',
      price: 9.99,
      image: 'image-url',
      categoryId: 'iuhnjewkfbn ewcewknv',
      toppings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    expect(() => Product.create(invalidProductProps as ProductConstructorProps)).toThrow(
      'Name is required'
    )
  })

  it('should throw validation error if price is negative', () => {
    const invalidProductProps: Partial<ProductConstructorProps> = {
      id: new ProductId().value,
      name: 'Marguerita',
      description: 'A delicious tomato and cheese pizza',
      // price: 9.99,
      image: 'image-url',
      categoryId: 'iuhnjewkfbn ewcewknv',
      toppings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    expect(() => Product.create(invalidProductProps as ProductConstructorProps)).toThrow(
      'Price is required'
    )
  })
})
