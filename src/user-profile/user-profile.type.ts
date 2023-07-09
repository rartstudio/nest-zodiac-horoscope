import { Prisma } from "@prisma/client";

export type UserProfileSelected = Prisma.UserProfileGetPayload<{
  select: {
    userId: true,
    name: true,
    gender: true,
    birthdate: true,
    height: true,
    weight: true,
    profileUrl: true,
    horoscope: true,
    zodiac: true,
  },
}>