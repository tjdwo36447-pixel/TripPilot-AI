import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.hotel.create({
      data,
    });
  }

  findAll() {
    return this.prisma.hotel.findMany({
      include: {
        trip: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.hotel.findUnique({
      where: { id },
      include: {
        trip: true,
      },
    });
  }

  update(id: string, data: any) {
    return this.prisma.hotel.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.hotel.delete({
      where: { id },
    });
  }
}