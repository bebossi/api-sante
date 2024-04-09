import { Product } from '@domain/product/entity/product/product'
import { ProductNotFound } from '@domain/product/errors/product-not-found'
import { IProductRepository } from '@domain/product/repository/product.repository.interface'
import { inject, injectable } from 'tsyringe'

interface GetProductDataInput {
  productId: string
}

@injectable()
class GetProductUsecase {
  constructor(
    @inject('IProductRepository')
    private productsRepository: IProductRepository
  ) {}

  public async execute({ productId }: GetProductDataInput): Promise<Product> {
    const product = await this.productsRepository.findById(productId)
    if (!product) throw new ProductNotFound()
    return product
  }
}

export { GetProductUsecase }
