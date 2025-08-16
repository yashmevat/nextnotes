import { verifyToken } from "./auth";

export async function getUserFromHeader(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
