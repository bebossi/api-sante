import { ProductRepository } from '@infra/product/prisma/repository/product.repository'
import { CreateProductRequest } from './dtos/product-controller.dto'
import { CreateProductUsecase } from 'app/product/create-product/create-product.usecase'
import { CategoryRepository } from '@infra/product/prisma/repository/category.repository'
import { GetProductsUsecase } from 'app/product/get-products/get-products.usecase'

export class ProductController {
  public async create(input: CreateProductRequest) {
    const { name, description, categoryId, image, price, toppings } = input
    try {
      const createProductUsecase = new CreateProductUsecase(
        new ProductRepository(),
        new CategoryRepository()
      )
      await createProductUsecase.execute({
        name,
        description,
        categoryId,
        image,
        price,
        toppings,
      })

      return { message: 'Product created successfully' }
    } catch (err) {
      console.log(err)

      return { message: 'Error while trying register a new product.' }
    }
  }

  public async getProducts() {
    try {
      const getProductsusecase = new GetProductsUsecase(new ProductRepository())
      const products = await getProductsusecase.execute()
      return products
    } catch (err) {
      console.log(err)
      return { message: 'Error while trying fetch products.' }
    }
  }
}
