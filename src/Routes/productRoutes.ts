import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { isAdmin } from "../middlewares/isAdmin";
import { ProductController } from "../Controller/ProductController";

const routes = Router();
const productController = new ProductController();

routes.post("/create", productController.createProduct);
routes.get("/getProducts", productController.getProducts);
routes.get("/getProduct/:productId", productController.getProduct);
routes.put("/updateProduct/:productId", productController.updateProduct);
routes.delete("/delete", productController.deleteProduct);
routes.get("/getCategories", productController.getCategories);
routes.post("/category", productController.createCategory);
routes.get("/getCategory/:categoryId", productController.getCategory);
routes.post("/createTopping", productController.createTopping);
routes.get("/getToppings", productController.getToppings);
routes.get("/getTopping/:toppingId", productController.getTopping);

export default routes;
