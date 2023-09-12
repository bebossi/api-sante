import express from "express";
import "dotenv/config";
import routes from "./Routes";
import expressSession from "express-session";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  expressSession({
    secret: process.env.TOKEN_SIGN_SECRET as string,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.raw({ type: "application/json" }));
app.use(cookieParser());

app.use(routes);
app.listen(process.env.PORT_EXPRESS, () => {
  console.log("Server listening on port", process.env.PORT_EXPRESS);
});
