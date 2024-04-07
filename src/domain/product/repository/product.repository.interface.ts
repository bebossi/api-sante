import { Product } from '../entity/product/product'
import { ProductId } from '../value-objects/product-id'

export interface IProductRepository {
  create(product: Product): Promise<void>
  findAll(): Promise<Product[] | null>
  findById(id: string | ProductId): Promise<Product | null>
}
