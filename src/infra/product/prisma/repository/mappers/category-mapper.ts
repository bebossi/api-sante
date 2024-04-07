import { Category as PrismaCategory } from '@prisma/client'
import { Category } from '@domain/product/entity/category/category'

class CategoryMapper {
  public static toPrisma(category: Category) {
    const map = {
      id: category.id.value,
      name: category.name,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    }

    return map
  }

  public static toEntity(input: PrismaCategory): Category {
    const category = Category.create({
      id: input.id,
      name: input.name,
      createdAt: input.created_at.toISOString(),
      updatedAt: input.updated_at.toISOString(),
    })

    return category
  }
}

export { CategoryMapper }
