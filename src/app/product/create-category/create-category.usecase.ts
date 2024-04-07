import { Category } from '@domain/product/entity/category/category'
import { ICategoryRepository } from '@domain/product/repository/category.repository.interface'
import { inject, injectable } from 'tsyringe'

export interface CreateCategoryUsecaseInput {
  name: string
}

export interface ICreateCategoryUsecases {
  execute(input: CreateCategoryUsecaseInput): Promise<void>
}
@injectable()
export class CreateCategoryUsecase implements ICreateCategoryUsecases {
  constructor(
    @inject('ICategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}
  async execute(input: CreateCategoryUsecaseInput): Promise<void> {
    const { name } = input

    const category = Category.create({
      name,
    })

    await this.categoryRepository.create(category)
  }
}
