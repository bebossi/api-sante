import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { isAdmin } from "../middlewares/isAdmin";
import { OrderController } from "../Controller/OrderController";

const routes = Router();
const orderController = new OrderController();

routes.post(
  "/testMercadoPago",
  authMiddleware,
  orderController.testMercadoPago
);
routes.get("/feedback", orderController.feedback);

routes.post("/addProduct", isAuth, authMiddleware, orderController.addProduct);
routes.delete(
  "/removeProduct",
  isAuth,
  authMiddleware,
  orderController.removeProduct
);
routes.post("/webhook", orderController.confirmOrder);
routes.post("/testCheckout", authMiddleware, orderController.testingOrder);
routes.put("/removeAll", authMiddleware, orderController.removeAll);
routes.get("/cart", authMiddleware, orderController.getCart);
routes.get("/filterOrders", isAdmin, orderController.filterOrders);
routes.get("/getOrder/:orderId", isAdmin, orderController.getOrder);
routes.get(
  "/ordersByClient",
  authMiddleware,
  orderController.getOrdersByClient
);
routes.get(
  "/orderByClient/:orderId",
  isAuth,
  authMiddleware,
  orderController.getOrderByClient
);
routes.put(
  "/statusOrder/:orderId",
  isAuth,
  isAdmin,
  orderController.statusOrder
);
routes.get("/totalRevenue", isAuth, isAdmin, orderController.getTotalRevenue);
routes.get("/graphRevenue", isAuth, isAdmin, orderController.getGraphRevenue);

export default routes;
