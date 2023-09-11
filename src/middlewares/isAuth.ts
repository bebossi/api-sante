import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export default expressjwt({
  secret: process.env.TOKEN_SIGN_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    if (req.headers.cookie?.split(";")[0].split("=")[1]) {
      return req.headers.cookie?.split(";")[0].split("=")[1];
    }
  },
});
