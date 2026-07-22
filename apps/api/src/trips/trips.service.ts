import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // 여행 생성
  create(data: any) {
    return this.prisma.trip.create({
      data,
    });
  }

  // 여행 목록 조회
  findAll(userId: string) {
  console.log("========== FIND ALL TRIPS ==========");
  console.log("SEARCH USER ID =", userId);

  return this.prisma.trip.findMany({
    where: {
      userId,
    },
    include: {
      schedules: true,
      flights: true,
      hotels: true,
      expenses: true,
    },
  });
}

  // 여행 상세 조회
  findOne(
    id: string,
    userId: string,
  ) {
    return this.prisma.trip.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: true,
        schedules: true,
        flights: true,
        hotels: true,
        expenses: true,
      },
    });
  }

  // 여행 수정
  async update(
    id: string,
    userId: string,
    data: any,
  ) {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!trip) {
      throw new NotFoundException(
        '수정할 여행을 찾을 수 없습니다.',
      );
    }

    return this.prisma.trip.update({
      where: {
        id,
      },
      data: {
        title: data.title,

        startDate: data.startDate
          ? new Date(data.startDate)
          : undefined,

        endDate: data.endDate
          ? new Date(data.endDate)
          : undefined,
      },
    });
  }

  // 여행 삭제
  async remove(
    id: string,
    userId: string,
  ) {
    console.log('========== DELETE ==========');
    console.log('Trip ID :', id);
    console.log('User ID :', userId);
    console.log(await this.prisma.trip.findMany()
);
    const trip = await this.prisma.trip.findFirst({
      where: {
        id,
        userId,
      },
    });

    console.log('Trip :', trip);

    if (!trip) {
      throw new NotFoundException(
        '삭제할 여행을 찾을 수 없습니다.',
      );
    }

    await this.prisma.trip.delete({
      where: {
        id,
      },
    });

    console.log('삭제 완료');

    return {
      message: '여행이 삭제되었습니다.',
    };
  }
}