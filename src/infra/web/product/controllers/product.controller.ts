import { ProductRepository } from '@infra/product/prisma/repository/product.repository'
import {
  CreateProductRequest,
  GetProductDataRequest,
} from './dtos/product-controller.dto'
import { CreateProductUsecase } from 'app/product/create-product/create-product.usecase'
import { CategoryRepository } from '@infra/product/prisma/repository/category.repository'
import { GetProductsUsecase } from 'app/product/get-products/get-products.usecase'
import { GetProductUsecase } from 'app/product/get-product/get-product.usecase'
import { ProductNotFound } from '@domain/product/errors/product-not-found'

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

  public async getProduct(input: GetProductDataRequest) {
    const { productId } = input

    try {
      const usecase = new GetProductUsecase(new ProductRepository())

      const product = await usecase.execute({ productId })

      return product
    } catch (error) {
      if (error instanceof ProductNotFound) {
        return { message: error.message }
      }
      return { message: 'Error while trying get the user data.' }
    }
  }
}
