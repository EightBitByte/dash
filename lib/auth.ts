import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET || "default-secret-change-me";
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}
