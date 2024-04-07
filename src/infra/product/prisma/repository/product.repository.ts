import { Product } from '@domain/product/entity/product/product'
import { IProductRepository } from '@domain/product/repository/product.repository.interface'
import { ProductId } from '@domain/product/value-objects/product-id'
import { ProductMapper } from './mappers/product-mapper'
import { prisma } from '@config/prisma'
import { Category } from '@domain/product/entity/category/category'

export class ProductRepository implements IProductRepository {
  async create(input: Product): Promise<void> {
    const productFormatted = ProductMapper.toPrisma(input)

    await prisma.product.create({
      data: {
        id: productFormatted.id,
        name: productFormatted.name,
        description: productFormatted.description,
        price: productFormatted.price,
        image: productFormatted.image,
        created_at: productFormatted.created_at,
        category_id: productFormatted.categoryId,
        toppings: {
          connectOrCreate: productFormatted.toppings.map((topping) => ({
            where: {
              // you need to provide a unique identifier condition here, for example:
              id: topping.id,
            },
            create: {
              id: topping.id,
              name: topping.name,
              description: topping.description,
              price: topping.price,
              productId: topping.productId,
              image: topping.image,
            },
          })),
        },
      },
    })
  }
  findAll(): Promise<Product[] | null> {
    throw new Error('Method not implemented.')
  }
  findById(id: string | ProductId): Promise<Product | null> {
    throw new Error('Method not implemented.')
  }

  async createCategory(input: Category): Promise<void> {
    await prisma.category.create({
      data: {
        name: input.name,
      },
    })
  }
}
