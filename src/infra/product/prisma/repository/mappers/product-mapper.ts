import { ProductPayload as PrismaProduct, ToppingPayload } from '@prisma/client'
import { Product } from '@domain/product/entity/product/product'

class ProductMapper {
  public static toPrisma(product: Product) {
    const map = {
      id: product.id.value,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      image: product.image,
      toppings: product.toppings,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    }

    return map
  }

  public static toEntity(input: PrismaProduct, toppings: ToppingPayload): Product {
    const product = Product.create({
      id: input.scalars.id,
      name: input.scalars.name,
      description: input.scalars.description,
      categoryId: input.scalars.category_id,
      image: input.scalars.image,
      toppings: input.objects.toppings.map((topping) => {
        return {
          id: topping.scalars.id,
          name: topping.scalars.name,
          description: topping.scalars.description,
          price: topping.scalars.price,
          productId: topping.scalars.product_id,
          image: topping.scalars.image,
        }
      }),

      createdAt: input.scalars.created_at,
      updatedAt: input.scalars.updated_at,
      price: 0,
    })

    return product
  }
}

export { ProductMapper }
