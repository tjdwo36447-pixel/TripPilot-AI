import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.schedule.create({
      data: {
        date: new Date(data.date),
        place: data.place,
        description: data.description,
        trip: {
          connect: {
            id: data.tripId,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.schedule.findMany({
      include: {
        trip: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: {
        trip: true,
      },
    });
  }

  update(id: string, data: any) {
    return this.prisma.schedule.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}