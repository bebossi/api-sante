import { FakeCategoryRepository } from '@domain/product/repository/fake/fake-category-repository'
import { CreateCategoryUsecase } from './create-category.usecase'

describe('CreateCategoryUsecase unit tests', () => {
  let categoriesRepository: FakeCategoryRepository
  let usecase: CreateCategoryUsecase

  beforeEach(() => {
    categoriesRepository = new FakeCategoryRepository()
    usecase = new CreateCategoryUsecase(categoriesRepository)
  })

  it('should create a new category', async () => {
    const registerSpy = jest.spyOn(categoriesRepository, 'create')
    const arrange = {
      name: 'Açai',
    }
    await usecase.execute(arrange)
    expect(registerSpy).toHaveBeenCalled()
  })

  it('should throw an error for invalid input', async () => {
    const invalidArrange = { name: '' } // Assuming empty name is invalid
    await expect(usecase.execute(invalidArrange)).rejects.toThrow('Name is required')
  })

  it('should correctly save the category with given name', async () => {
    const arrange = { name: 'Fast Food' }
    await usecase.execute(arrange)
    const createdCategory = categoriesRepository.categories.find(
      (c) => c.name === arrange.name
    )
    expect(createdCategory).toBeDefined()
    expect(createdCategory?.name).toBe(arrange.name)
  })
})
