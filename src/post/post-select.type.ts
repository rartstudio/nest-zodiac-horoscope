import { Prisma } from "@prisma/client";

export type PostSelected = Prisma.PostGetPayload<{
  select: {
    id: true,
    content: true,
    user: {
      select: {
        id: true,
        name: true,
      }
    },
    comments: {
      select: {
        id: true,
        content: true,
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    },
    likes: {
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
}>