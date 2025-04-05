import { UserRole } from "@/drizzle/schema";

export function canAccessAdminPages(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canAccessConsumerPages(user: { role?: UserRole }) {
  return user.role === "user"
}


