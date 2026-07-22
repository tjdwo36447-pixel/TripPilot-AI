import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit {

  constructor() {
    console.log('DATABASE_URL =', process.env.DATABASE_URL);

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();

    const db = await this.$queryRawUnsafe(
      'SELECT current_database() AS database'
    );

    console.log('Connected DB =', db);

    const trips = await this.$queryRawUnsafe(
      'SELECT COUNT(*) AS count FROM "Trip"'
    );

    console.log('Trip Count =', trips);
  }
}