import { Product } from '@domain/product/entity/product/product'
import { ToppingModel } from '@domain/product/entity/topping'
import { CategoryNotFoundError } from '@domain/product/errors/category-not-found-error'
import { ICategoryRepository } from '@domain/product/repository/category.repository.interface'
import { IProductRepository } from '@domain/product/repository/product.repository.interface'
import { inject, injectable } from 'tsyringe'

export interface CreateProductUsecaseInput {
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  toppings: ToppingModel[]
}

export interface ICreateProductUsecases {
  execute(input: CreateProductUsecaseInput): Promise<CategoryUseCaseOutput>
}

interface CategoryUseCaseOutput {
  message: string
}

@injectable()
export class CreateProductUsecase implements ICreateProductUsecases {
  constructor(
    @inject('IProductRepository')
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}
  async execute(input: CreateProductUsecaseInput): Promise<CategoryUseCaseOutput> {
    const { name, description, price, image, categoryId, toppings } = input

    const category = await this.categoryRepository.findById(categoryId)

    if (!category) throw new CategoryNotFoundError()

    const product = Product.create({
      name,
      description,
      price,
      image,
      categoryId,
      toppings,
    })

    await this.productRepository.create(product)

    return { message: 'Product created successfully' }
  }
}
