import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class AppointmentController {
  async createAppointment(req: Request, res: Response) {
    try {
      const { startDate, endTime } = req.body;

      const appointment = await prisma.availableAppointment.create({
        data: {
          startDate: startDate,
          endTime: endTime,
          isAvailable: true,
        },
      });

      return res.status(201).json(appointment);
    } catch (err) {
      console.log(err);
      return res.status(404).json(err);
    }
  }

  async getAppointments(req: Request, res: Response) {
    try {
      const currentDate = new Date();

      const appointments = await prisma.availableAppointment.findMany({
        where: {
          startDate: {
            gte: currentDate,
          },
        },
        orderBy: {
          startDate: "asc",
        },
      });

      return res.status(200).json(appointments);
    } catch (err) {
      console.log(err);
      return res.status(404).json(err);
    }
  }

  async createIsRestaurantOpen(req: Request, res: Response) {
    try {
      const isOpen = await prisma.isRestaurantOpen.create({
        data: {
          isOpen: true,
          updatedDate: new Date(),
        },
      });

      return res.status(200).json(isOpen);
    } catch (err) {
      console.log(err);
      return res.status(404).json(err);
    }
  }

  async isRestaurantOpen(req: Request, res: Response) {
    try {
      const isOpen = await prisma.isRestaurantOpen.findFirst();

      return res.status(200).json(isOpen);
    } catch (err) {
      console.log(err);
      return res.status(404).json(err);
    }
  }

  async isRestaurantOpenUpdate(req: Request, res: Response) {
    try {
      const isOpen = await prisma.isRestaurantOpen.findFirst();

      await prisma.isRestaurantOpen.update({
        where: {
          id: isOpen?.id,
        },
        data: {
          isOpen: !isOpen?.isOpen,
        },
      });

      return res.status(200).json("Updated successfully");
    } catch (err) {
      console.log(err);
      return res.status(404).json(err);
    }
  }
}
