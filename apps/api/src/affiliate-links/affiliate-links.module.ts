import { Module } from '@nestjs/common';

import { AffiliateLinksController } from './affiliate-links.controller';

import { AffiliateLinksService } from './affiliate-links.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    AffiliateLinksController,
  ],

  providers: [
    AffiliateLinksService,
  ],

  exports: [
    AffiliateLinksService,
  ],
})
export class AffiliateLinksModule {}