import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';
import { SchedulesModule } from './schedules/schedules.module';
import { FlightsModule } from './flights/flights.module';
import { HotelsModule } from './hotels/hotels.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { AffiliateLinksModule } from './affiliate-links/affiliate-links.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    PrismaModule,
    TripsModule,
    UsersModule,
    SchedulesModule,
    FlightsModule,
    HotelsModule,
    ExpensesModule,
    AiModule,
    AuthModule,
    AffiliateLinksModule,
  ],
})
export class AppModule {}