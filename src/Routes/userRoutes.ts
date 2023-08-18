import { Router } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { UserController } from "../Controller/UserController";

const routes = Router();
const userController = new UserController();

routes.post("/signup", userController.signUp);
routes.post("/login", userController.login);
routes.put("/update", isAuth, authMiddleware, userController.updateUser);
routes.get(
  "/currentUser",
  isAuth,
  authMiddleware,
  userController.getCurrentUser
);
routes.post("/guestUser", userController.guestUser);
routes.post("/address", isAuth, authMiddleware, userController.createAddress);

export default routes;
