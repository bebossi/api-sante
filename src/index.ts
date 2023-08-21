import express from "express";
import "dotenv/config";
import routes from "./Routes";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bodyParser from "body-parser";

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

// app.use(bodyParser.raw({ type: "application/json" }));
app.use(cors());
// app.use(express.json());
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === "/webhook") {
      express.raw({ type: "application/json" });
      next();
    } else {
      express.json()(req, res, next);
    }
  }
);
app.use(express.raw({ type: "application/json" }));
app.use(routes);
app.listen(process.env.PORT_EXPRESS, () => {
  console.log("Server listening on port", process.env.PORT_EXPRESS);
});
