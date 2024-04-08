import { Product } from '@domain/product/entity/product/product'
import { NoProductsRegisteredError } from '@domain/product/errors/no-products-registered-error'
import { IProductRepository } from '@domain/product/repository/product.repository.interface'
import { inject, injectable } from 'tsyringe'

@injectable()
class GetProductsUsecase {
  constructor(
    @inject('IProductRepository')
    private productsRepository: IProductRepository
  ) {}

  public async execute(): Promise<Product[]> {
    const products = await this.productsRepository.findAll()
    if (!products) throw new NoProductsRegisteredError()
    return products
  }
}

export { GetProductsUsecase }
