import { CategoryId } from '@domain/product/value-objects/category-id'
import { Category, CategoryConstructorProps } from './category'
import ProductValidatorFactory from '@domain/product/factories/validators/product-validator.factory'
import CategoryValidatorFactory from '@domain/product/factories/validators/category-validator.factory'

describe('Category entity', () => {
  const categoryProps = {
    id: new CategoryId().value,
    name: 'Side dishes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create a category with provided properties', () => {
    const category = new Category(categoryProps)

    expect(category.id.value).toBe(categoryProps.id)
    expect(category.name).toBe(categoryProps.name)

    expect(category.createdAt.toISOString()).toBe(categoryProps.createdAt)
    expect(category.updatedAt.toISOString()).toBe(categoryProps.updatedAt)
  })

  it('should create a category and call validate method', () => {
    jest.spyOn(CategoryValidatorFactory, 'create').mockReturnValue({
      validate: jest.fn(),
    })
    const category = Category.create(categoryProps)

    expect(CategoryValidatorFactory.create).toHaveBeenCalled()
    expect(category).toBeInstanceOf(Category)
  })

  it('should validate the category entity', () => {
    jest.spyOn(CategoryValidatorFactory, 'create').mockReturnValue({
      validate: jest.fn(),
    })
    const category = new Category(categoryProps)
    category.validate()

    const validator = CategoryValidatorFactory.create()
    expect(validator.validate).toHaveBeenCalledWith(category)
  })

  it('should throw validation error if name is missing', () => {
    const invalidProductProps: Partial<CategoryConstructorProps> = {
      id: new CategoryId().value,
      // name: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    expect(() =>
      Category.create(invalidProductProps as CategoryConstructorProps)
    ).toThrow('Name is required')
  })
})
