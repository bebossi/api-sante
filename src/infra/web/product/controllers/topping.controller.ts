import { CreateToppingUsecase } from 'app/product/create-topping/create-topping.usecase'
import {
  CreateToppingRequest,
  CreateToppingResponse,
} from './dtos/topping-controller.dto'
import { ProductRepository } from '@infra/product/prisma/repository/product.repository'
import { ToppingRepository } from '@infra/product/prisma/repository/topping.repository'

export class ToppingController {
  public async create(input: CreateToppingRequest): Promise<CreateToppingResponse> {
    const { name, description, productId, image, price } = input
    try {
      const createToppingUsecase = new CreateToppingUsecase(
        new ProductRepository(),
        new ToppingRepository()
      )
      await createToppingUsecase.execute({
        name,
        description,
        productId,
        image,
        price,
      })

      return { message: 'Topping created successfully' }
    } catch (err) {
      console.log(err)

      return { message: 'Error while trying register a new topping.' }
    }
  }
}
