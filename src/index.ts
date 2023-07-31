import express from "express";
import "dotenv/config";
import routes from "./Routes";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.TOKEN_SIGN_SECRET!,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(routes);

app.listen(process.env.PORT_EXPRESS, () => {
  console.log("Server listening on port", process.env.PORT_EXPRESS);
});
