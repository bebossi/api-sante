import { FakeProductRepository } from '@domain/product/repository/fake/fake-product-repository'
import { GetProductsUsecase } from './get-products.usecase'
import { Product } from '@domain/product/entity/product/product'
import { CategoryId } from '@domain/product/value-objects/category-id'
import { ProductId } from '@domain/product/value-objects/product-id'
import { NoProductsRegisteredError } from '@domain/product/errors/no-products-registered-error'

describe('GetProductsUsecase', () => {
  let getProductsUsecase: GetProductsUsecase
  let fakeProductRepository: FakeProductRepository

  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository()
    getProductsUsecase = new GetProductsUsecase(fakeProductRepository)
  })

  it('should return products when there are products registered', async () => {
    const product = new Product({
      id: new ProductId(),
      name: 'Test Product',
      description: 'This is a test product',
      price: 10,
      image: 'image-url',
      categoryId: new CategoryId(),
      toppings: [],
    })
    await fakeProductRepository.create(product)

    const products = await getProductsUsecase.execute()

    expect(products).toHaveLength(1)
    expect(products[0]).toEqual(product)
  })

  it('should throw NoProductsRegisteredError when there are no products registered', async () => {
    await expect(getProductsUsecase.execute()).rejects.toThrow(NoProductsRegisteredError)
  })
})
