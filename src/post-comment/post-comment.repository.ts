import { PrismaService } from '../prisma/prisma.service';

export class PostCommentRepository {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: string, postId: string, userId: string) {
    return await this.prismaService.postComment.findFirst({
      where: {
        id,
        postId,
        userId,
      },
    });
  }

  async create(postId: string, userId: string, id: string, content: string) {
    return await this.prismaService.postComment.create({
      data: {
        id,
        content,
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

  async delete(id: string) {
    return await this.prismaService.postComment.delete({
      where: {
        id,
      },
    });
  }
}
