import { Product } from '@domain/product/entity/product/product'
import { IProductRepository } from '../product.repository.interface'
import { ProductId } from '@domain/product/value-objects/product-id'

class FakeProductRepository implements IProductRepository {
  public products: Product[]

  constructor() {
    this.products = []
  }
  async create(input: Product): Promise<void> {
    this.products.push(input)
  }
  async findAll(): Promise<Product[] | null> {
    if (this.products.length <= 0) return null
    return this.products
  }
  async findById(userId: string | ProductId): Promise<Product | null> {
    let id: ProductId
    if (!(userId instanceof ProductId)) {
      id = new ProductId(userId)
    }
    const product = this.products.find((product) => {
      return product.id.equals(id)
    })

    if (!product) return null
    return product
  }
}

export { FakeProductRepository }
