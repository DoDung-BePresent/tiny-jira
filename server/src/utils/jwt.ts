import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const generateTokens = (payload: { userId: string }) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "30d",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as jwt.JwtPayload & { userId: number };
};
