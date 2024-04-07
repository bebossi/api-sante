import { prisma } from '@config/prisma'
import { Category } from '@domain/product/entity/category/category'
import { ICategoryRepository } from '@domain/product/repository/category.repository.interface'
import { CategoryId } from '@domain/product/value-objects/category-id'
import { CategoryMapper } from './mappers/category-mapper'

export class CategoryRepository implements ICategoryRepository {
  async create(input: Category): Promise<void> {
    const categoryFormatted = CategoryMapper.toPrisma(input)
    await prisma.category.create({
      data: {
        ...categoryFormatted,
      },
    })
  }
  async findById(categoryId: string | CategoryId): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId instanceof CategoryId ? categoryId.value : categoryId,
      },
    })
    if (!category) return null
    return CategoryMapper.toEntity(category)
  }
}
