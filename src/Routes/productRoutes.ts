import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { isAdmin } from "../middlewares/isAdmin";
import { ProductController } from "../Controller/ProductController";

const routes = Router();
const productController = new ProductController();

routes.post("/create", isAuth, isAdmin, productController.createProduct);
routes.post("/category", isAuth, isAdmin, productController.createCategory);
routes.post("/createTopping", isAuth, isAdmin, productController.createTopping);

export default routes;
