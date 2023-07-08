import { PostType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PostSelected } from './post-select.type';

export class PostRepository {
  constructor(private prismaService: PrismaService) {}

  private selectedData = {
    select: {
      id: true,
      content: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
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
  };

  async create(
    userId: string,
    content: string,
    id: string,
  ): Promise<PostSelected> {
    return await this.prismaService.post.create({
      data: {
        id,
        content,
        status: PostType.ACTIVE,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      ...this.selectedData,
    });
  }

  async getByUserId(userId: string): Promise<PostSelected[]> {
    return await this.prismaService.post.findMany({
      where: {
        userId,
      },
      ...this.selectedData,
    });
  }

  async getByPostIdAndUserId(
    userId: string,
    postId: string,
  ): Promise<PostSelected> {
    return await this.prismaService.post.findFirst({
      where: {
        id: postId,
        userId,
      },
      ...this.selectedData,
    });
  }

  async getAll(): Promise<PostSelected[]> {
    return await this.prismaService.post.findMany({
      ...this.selectedData,
    });
  }

  async getDetail(postId: string): Promise<PostSelected> {
    return await this.prismaService.post.findFirst({
      where: {
        id: postId,
      },
      ...this.selectedData,
    });
  }

  async delete(postId: string) {
    return await this.prismaService.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async archive(postId: string): Promise<PostSelected> {
    return await this.prismaService.post.update({
      where: {
        id: postId,
      },
      data: {
        status: PostType.ARCHIVE,
      },
      ...this.selectedData,
    });
  }
}
