import { Category } from '../entity/category/category'
import { CategoryId } from '../value-objects/category-id'

export interface ICategoryRepository {
  create(category: Category): Promise<void>
  findById(categoryId: string | CategoryId): Promise<Category | null>
}
