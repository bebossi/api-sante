import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { isAdmin } from "../middlewares/isAdmin";
import { OrderController } from "../Controller/OrderController";

const routes = Router();
const orderController = new OrderController();

// routes.put("/add", isAuth, authMiddleware, orderController.addProduct);
routes.put("/remove", isAuth, authMiddleware, orderController.removeProduct);
routes.delete(
  "/removeProduct",
  isAuth,
  authMiddleware,
  orderController.removeProductt
);
routes.put("/removeAll", authMiddleware, orderController.removeAll);
routes.post(
  "/webhook",
  // express.raw({ type: "application/json" }),
  orderController.confirmOrder
);

routes.post(
  "/increaseQuantityProd",

  authMiddleware,
  orderController.putQuantity
);
routes.post("/addProduct", authMiddleware, orderController.addProduct);
routes.post(
  "/testCheckout",

  authMiddleware,
  orderController.testingOrder
);
routes.get("/cart", isAuth, authMiddleware, orderController.getCart);
routes.get("/get", orderController.deletingAll);
routes.get("/getOrders", isAuth, isAdmin, orderController.getOrders);
routes.get("/getOrder/:orderId", isAuth, isAdmin, orderController.getOrder);

export default routes;
