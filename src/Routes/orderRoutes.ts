import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { isAdmin } from "../middlewares/isAdmin";
import { OrderController } from "../Controller/OrderController";

const routes = Router();
const orderController = new OrderController();

routes.post("/add", isAuth, authMiddleware, orderController.addProduct);
routes.put("/remove", isAuth, authMiddleware, orderController.removeProduct);

export default routes;
