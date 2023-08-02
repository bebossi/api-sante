import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { isAdmin } from "../middlewares/isAdmin";
import { OrderController } from "../Controller/OrderController";

const routes = Router();
const orderController = new OrderController();

routes.put("/add", isAuth, authMiddleware, orderController.addProduct);
routes.put("/remove", isAuth, authMiddleware, orderController.removeProduct);
routes.put("/removeAll", isAuth, authMiddleware, orderController.removeAll);
routes.post("/checkout", isAuth, authMiddleware, orderController.checkout);

export default routes;
