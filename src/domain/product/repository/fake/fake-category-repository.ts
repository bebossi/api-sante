import { Product } from '@domain/product/entity/product/product'
import { IProductRepository } from '../product.repository.interface'
import { Category } from '@domain/product/entity/category/category'
import { ProductId } from '@domain/product/value-objects/product-id'
import { ICategoryRepository } from '../category.repository.interface'
import { CategoryId } from '@domain/product/value-objects/category-id'
import { CategoryNotFoundError } from '@domain/product/errors/category-not-found-error'

class FakeCategoryRepository implements ICategoryRepository {
  public categories: Category[]

  constructor() {
    this.categories = []
  }
  async create(input: Category): Promise<void> {
    this.categories.push(input)
  }
  async findById(categoryId: string | CategoryId): Promise<Category | null> {
    let id: CategoryId
    if (!(categoryId instanceof CategoryId)) {
      id = new CategoryId(categoryId)
    }
    const category = this.categories.find((category) => category.id.equals(id))
    if (!category) return null
    return category
  }
}

export { FakeCategoryRepository }
