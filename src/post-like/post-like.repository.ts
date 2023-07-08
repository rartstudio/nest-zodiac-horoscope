import { PrismaService } from '../prisma/prisma.service';

export class PostLikeRepository {
  constructor(private prismaService: PrismaService) {}

  async findOne(postId: string, userId: string) {
    return await this.prismaService.postLike.findFirst({
      where: {
        postId,
        userId,
      },
    });
  }

  async create(postId: string, userId: string) {
    return await this.prismaService.postLike.create({
      data: {
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async delete(postId: string, userId: string) {
    return await this.prismaService.postLike.delete({
      where: {
        postId,
        userId,
      },
    });
  }
}
