import { CreateCategoryUsecase } from 'app/product/create-category/create-category.usecase'
import { CategoryRepository } from '@infra/product/prisma/repository/category.repository'
import { CreateCategoryRequest } from './dtos/category-controller.dto'

export class CategoryController {
  public async create(input: CreateCategoryRequest) {
    const { name } = input
    try {
      const createProductUsecase = new CreateCategoryUsecase(new CategoryRepository())
      await createProductUsecase.execute({
        name,
      })

      return { message: 'Category created successfully' }
    } catch (err) {
      console.log(err)

      return { message: 'Error while trying register a new product.' }
    }
  }
}
