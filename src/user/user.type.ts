import { Prisma } from "@prisma/client";

export type UserSelected = Prisma.UserGetPayload<{
  select: {
    id: true,
    username: true,
    email: true,
    password: true,
  },
}>