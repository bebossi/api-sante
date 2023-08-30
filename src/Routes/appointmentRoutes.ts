import express, { Router, Request, Response } from "express";
import isAuth from "../middlewares/isAuth";
import { authMiddleware } from "../middlewares/attachCurrentUser";
import { isAdmin } from "../middlewares/isAdmin";
import bodyParser from "body-parser";
import Stripe from "stripe";
import { stripe } from "../libs/stripe";
import { PrismaClient } from "@prisma/client";
import { AppointmentController } from "../Controller/AppointmentController";

const prisma = new PrismaClient();

const routes = Router();
const appointmentController = new AppointmentController();

routes.post(
  "/createAppointment",
  isAuth,
  isAdmin,
  appointmentController.createAppointment
);
routes.get(
  "/getAppointments",
  isAuth,
  isAdmin,
  appointmentController.getAppointments
);

export default routes;
