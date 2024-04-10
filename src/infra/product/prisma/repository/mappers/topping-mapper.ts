import { Topping } from '@domain/product/entity/topping/topping'
import { Topping as PrismaTopping } from '@prisma/client'

class ToppingMapper {
  public static toPrisma(topping: Topping) {
    const map = {
      id: topping.id.value,
      name: topping.name,
      description: topping.description,
      price: topping.price,
      product_id: topping.productId,
      image: topping.image,
    }

    return map
  }

  public static toEntity(input: PrismaTopping): Topping {
    const product = Topping.create({
      id: input.id,
      name: input.name as string,
      description: input.description as string,
      productId: input.product_id as string,
      image: input.image as string,
      price: input.price,
    })

    return product
  }
}

export { ToppingMapper }
