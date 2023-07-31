import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export function generateToken(user: User) {
  const { id, name, email, role } = user;

  const signature: string = process.env.TOKEN_SIGN_SECRET as string;

  const expiration = "8h";

  return jwt.sign({ id, name, email, role }, signature, {
    expiresIn: expiration,
  });
}
