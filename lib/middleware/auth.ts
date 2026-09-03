import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AuthResult } from "@/interfaces";
import { AuthorizationResult } from "@/interfaces";

/**
 * Authenticates JWT token from request cookies
 * Verifies signature, expiration, and extracts user data
 * @param request - The incoming HTTP request
 * @returns AuthResult with user data or error
 */
export async function authenticateToken(
  request: Request
): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return { error: "No token provided", status: 401 };
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return { error: "Server configuration error", status: 500 };
    }

    try {
      const decoded = jwt.verify(token.value, JWT_SECRET) as {
        email: string;
        role?: string;
      };
      return { user: decoded, status: 200 };
    } catch (jwtError: any) {
      if (jwtError.name === "TokenExpiredError") {
        return { error: "Token has expired", status: 401 };
      }
      if (jwtError.name === "JsonWebTokenError") {
        return { error: "Invalid token", status: 401 };
      }
      return { error: "Token verification failed", status: 401 };
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Authentication failed", status: 500 };
  }
}

/**
 * Verifies that the authenticated user has admin privileges
 * @param user - The authenticated user object
 * @returns AuthorizationResult indicating if user is admin
 */
export function requireAdmin(user: {
  email: string;
  role?: string;
}): AuthorizationResult {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("ADMIN_EMAIL is not defined in environment variables");
    return { error: "Server configuration error", status: 500 };
  }

  if (user.email !== adminEmail) {
    return { error: "Admin access required", status: 403 };
  }

  return { authorized: true, status: 200 };
}

/**
 * Verifies that the authenticated user owns the task they're accessing
 * @param user - The authenticated user object
 * @param taskAssign - The email of the user the task is assigned to
 * @returns AuthorizationResult indicating if user owns the task
 */
export function verifyTaskOwnership(
  user: { email: string },
  taskAssign: string
): AuthorizationResult {
  if (user.email !== taskAssign) {
    return {
      error: "You can only access your own tasks",
      status: 403,
    };
  }

  return { authorized: true, status: 200 };
}
