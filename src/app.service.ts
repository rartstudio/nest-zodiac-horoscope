import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  pagination(page: number | null, limit: number | null) {
    const take = limit ? limit : 10;
    const skip = page ? (page > 1 ? page - 1 : 0) : 0;
    return {
      skip: skip * take,
      take,
    };
  }

  paginationResult(
    page: number,
    total: number,
    take: number,
  ): {
    meta: {
      currentPage: number;
      lastPage: number;
      total: number;
      perPage: number;
    };
  } {
    const lastPage = Math.ceil(total / take);
    const currentPage = page > 1 ? page : 1;

    return {
      meta: {
        currentPage,
        lastPage,
        total,
        perPage: take,
      },
    };
  }
}
