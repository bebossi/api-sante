// import express, { Router, Request, Response } from 'express'
// import isAuth from '../middlewares/isAuth'
// import { authMiddleware } from '../middlewares/attachCurrentUser'
// import { isAdmin } from '../middlewares/isAdmin'
// import bodyParser from 'body-parser'
// import Stripe from 'stripe'
// import { stripe } from '../@config/libs/stripe'
// import { PrismaClient } from '@prisma/client'
// import { AppointmentController } from '../domain/Controller/AppointmentController'

// const prisma = new PrismaClient()

// const routes = Router()
// const appointmentController = new AppointmentController()

// routes.post(
//   '/createAppointment',
//   isAuth,
//   isAdmin,
//   appointmentController.createAppointment
// )
// routes.get('/getAppointments', authMiddleware, appointmentController.getAppointments)
// routes.post(
//   '/createIsOpen',
//   isAuth,
//   isAdmin,
//   appointmentController.createIsRestaurantOpen
// )
// routes.get('/getIsOpen', appointmentController.isRestaurantOpen)
// routes.put('/updateIsOpen', isAuth, isAdmin, appointmentController.isRestaurantOpenUpdate)

// export default routes
