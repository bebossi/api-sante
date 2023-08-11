import express from "express";
import "dotenv/config";
import routes from "./Routes";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();

app.use(
  expressSession({
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    secret: process.env.TOKEN_SIGN_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT_EXPRESS, () => {
  console.log("Server listening on port", process.env.PORT_EXPRESS);
});
