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
      const appointments = await prisma.availableAppointment.findMany({
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
}
