import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.expense.create({
      data,
    });
  }

  findAll() {
    return this.prisma.expense.findMany({
      include: {
        trip: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.expense.findUnique({
      where: { id },
      include: {
        trip: true,
      },
    });
  }

  update(id: string, data: any) {
    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.expense.delete({
      where: { id },
    });
  }
}