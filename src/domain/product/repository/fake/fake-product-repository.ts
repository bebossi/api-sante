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
  findAll(): Promise<Product[] | null> {
    throw new Error('Method not implemented.')
  }
  findById(id: string | ProductId): Promise<Product | null> {
    throw new Error('Method not implemented.')
  }
}

export { FakeProductRepository }
