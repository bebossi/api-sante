import { ProductMapper } from './mappers/product-mapper'
import { prisma } from '@config/prisma'
import { IToppingRepository } from '@domain/product/repository/topping.repository.interface'
import { Topping } from '@domain/product/entity/topping/topping'
import { ToppingMapper } from './mappers/topping-mapper'

export class ToppingRepository implements IToppingRepository {
  async create(input: Topping): Promise<void> {
    const toppingFormatted = ToppingMapper.toPrisma(input)

    await prisma.topping.create({
      data: {
        id: toppingFormatted.id,
        name: toppingFormatted.name,
        description: toppingFormatted.description,
        price: toppingFormatted.price,
        image: toppingFormatted.image,
        product_id: toppingFormatted.product_id.value,
      },
    })
  }
}
