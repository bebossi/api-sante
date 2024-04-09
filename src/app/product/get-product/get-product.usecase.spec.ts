import { FakeProductRepository } from '@domain/product/repository/fake/fake-product-repository'
import { GetProductUsecase } from './get-product.usecase'
import { ProductId } from '@domain/product/value-objects/product-id'
import { Product } from '@domain/product/entity/product/product'
import { CategoryId } from '@domain/product/value-objects/category-id'
import { ProductNotFound } from '@domain/product/errors/product-not-found'

describe('GetProductUsecase', () => {
  let getProductUsecase: GetProductUsecase
  let fakeProductRepository: FakeProductRepository
  const existingProductId = new ProductId()
  const nonExistingProductId = new ProductId()

  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository()
    getProductUsecase = new GetProductUsecase(fakeProductRepository)

    const product = new Product({
      id: existingProductId,
      name: 'Test Product',
      description: 'This is a test product',
      price: 10,
      image: 'image',
      categoryId: new CategoryId(),
      toppings: [],
    })
    fakeProductRepository.create(product)
  })

  it('should return a product when it exists', async () => {
    const product = await getProductUsecase.execute({
      productId: existingProductId.value,
    })

    expect(product).toBeDefined()
    expect(product.id).toEqual(existingProductId)
  })

  it('should throw ProductNotFound when the product does not exist', async () => {
    await expect(
      getProductUsecase.execute({ productId: nonExistingProductId.value })
    ).rejects.toThrow(ProductNotFound)
  })
})
