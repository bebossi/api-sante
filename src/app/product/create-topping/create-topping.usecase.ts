import { Topping } from '@domain/product/entity/topping/topping'
import { ProductNotFound } from '@domain/product/errors/product-not-found'
import { IProductRepository } from '@domain/product/repository/product.repository.interface'
import { IToppingRepository } from '@domain/product/repository/topping.repository.interface'
import { inject, injectable } from 'tsyringe'

export interface CreateToppingUsecaseInput {
  name: string
  description: string
  price: number
  image: string
  productId: string
}

export interface ICreateToppingUsecases {
  execute(input: CreateToppingUsecaseInput): Promise<ToppingUseCaseOutput>
}
interface ToppingUseCaseOutput {
  message: string
}

@injectable()
export class CreateToppingUsecase implements ICreateToppingUsecases {
  constructor(
    @inject('IProductRepository')
    private productRepository: IProductRepository,
    private toppingRepository: IToppingRepository
  ) {}
  async execute(input: CreateToppingUsecaseInput): Promise<ToppingUseCaseOutput> {
    const { name, description, price, image, productId } = input

    const product = await this.productRepository.findById(productId)

    if (!product) throw new ProductNotFound()

    const topping = Topping.create({
      name,
      description,
      price,
      image,
      productId,
    })

    await this.toppingRepository.create(topping)

    return { message: 'Topping created successfully' }
  }
}
