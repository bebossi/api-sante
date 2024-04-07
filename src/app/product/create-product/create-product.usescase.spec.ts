import { FakeProductRepository } from '@domain/product/repository/fake/fake-product-repository'
import { CreateProductUsecase } from './create-product.usecase'
import { FakeCategoryRepository } from '@domain/product/repository/fake/fake-category-repository'
import { Category } from '@domain/product/entity/category/category'
import { ProductConstructorProps } from '@domain/product/entity/product/product'
import { CategoryNotFoundError } from '@domain/product/errors/category-not-found-error'
import { CategoryId } from '@domain/product/value-objects/category-id'

describe('RegisterUseCase unit tests', () => {
  let productsRepository: FakeProductRepository
  let categoryRepository: FakeCategoryRepository
  let createProductUsecase: CreateProductUsecase

  beforeEach(() => {
    productsRepository = new FakeProductRepository()
    categoryRepository = new FakeCategoryRepository()
    createProductUsecase = new CreateProductUsecase(
      productsRepository,
      categoryRepository
    )
  })

  it('should create a new product', async () => {
    const category = Category.create({ name: 'Side dishes' })
    await categoryRepository.create(category)

    const productArrange = {
      name: 'Açai',
      description: 'Delicious açai',
      price: 15,
      categoryId: category.id.value,
      image: 'uigewkjnf,mnew',
      toppings: [],
    }

    const createProductSpy = jest.spyOn(productsRepository, 'create')
    const findCategorySpy = jest.spyOn(categoryRepository, 'findById')

    await createProductUsecase.execute(productArrange)

    expect(findCategorySpy).toHaveBeenCalledWith(category.id.value)
    expect(createProductSpy).toHaveBeenCalled()
  })

  it('should throw CategoryNotFoundError if category does not exist', async () => {
    const productArrange = {
      name: 'Açai',
      description: 'Delicious açai',
      price: 15,
      categoryId: new CategoryId().value,
      image: 'uigewkjnf,mnew',
      toppings: [],
    }

    await expect(createProductUsecase.execute(productArrange)).rejects.toThrow(
      CategoryNotFoundError
    )
  })

  it('should not create a product with invalid name', async () => {
    const category = Category.create({ name: 'Side dishes' })
    await categoryRepository.create(category)
    const invalidProductData = {
      name: '',
      description: 'No name',
      price: -10, // Invalid because it's negative
      categoryId: category.id.value,
      image: 'some-image',
      toppings: [],
    }

    await expect(createProductUsecase.execute(invalidProductData)).rejects.toThrow(
      'Name is required'
    )
  })

  it('should not create a product with invalid price', async () => {
    const category = Category.create({ name: 'Side dishes' })
    await categoryRepository.create(category)
    const invalidProductData: Partial<ProductConstructorProps> = {
      name: category.name,
      description: 'No name',
      // price: -10,
      categoryId: category.id.value,
      image: 'some-image',
      toppings: [],
    }

    await expect(
      createProductUsecase.execute(invalidProductData as ProductConstructorProps)
    ).rejects.toThrow('Price is required')
  })
})
