import { Prisma } from "@prisma/client";

export type UserSelected = Prisma.UserGetPayload<{
  select: {
    id: true,
    name: true,
    email: true,
    countryCode: true,
    phoneNumber: true,
    emailVerifiedAt: true,
    profileUrl: true,
    password: true,
    otp: true,
    tokenReset: true,
  },
}>