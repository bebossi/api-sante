import { ProductPayload, Product as PrismaProduct, ToppingPayload } from '@prisma/client'
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

  public static toEntity(
    input: PrismaProduct & { toppings: any },
    toppings?: ToppingPayload
  ): Product {
    const product = Product.create({
      id: input.id,
      name: input.name as string,
      description: input.description as string,
      categoryId: input.category_id as string,
      image: input.image as string,
      createdAt: input.created_at,
      updatedAt: input.updated_at,
      price: 0,
      toppings:
        input.toppings?.map(
          (topping: {
            id: any
            name: any
            description: any
            price: any
            product_id: any
            image: any
          }) => ({
            id: topping.id,
            name: topping.name,
            description: topping.description,
            price: topping.price,
            productId: topping.product_id,
            image: topping.image,
          })
        ) || [],
    })

    return product
  }
}

export { ProductMapper }
