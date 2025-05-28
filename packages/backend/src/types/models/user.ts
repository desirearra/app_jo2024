/**
 * User type for business logic and API
 * Matches the Prisma User model
 */
export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  key1?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

/**
 * JwtUser type for authentication payload
 * Used in JWT, AuthenticatedRequest, and middleware
 */
export type JwtUser = {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
};
