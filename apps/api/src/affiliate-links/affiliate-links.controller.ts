import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { AffiliateLinksService } from './affiliate-links.service';

@Controller('affiliate-links')
export class AffiliateLinksController {
  constructor(
    private readonly affiliateLinksService: AffiliateLinksService,
  ) {}

  // ======================================
  // 클릭 추적 후 외부 사이트 이동
  // GET /affiliate-links/:id/click
  // ======================================

  @Get(':id/click')
  async click(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const result =
      await this.affiliateLinksService.click(
        id,
      );

    return res.redirect(
      result.url,
    );
  }

  // ======================================
  // 제휴 링크 생성
  // POST /affiliate-links
  // ======================================

  @Post()
  create(
    @Body()
    body: {
      provider: string;
      type: string;
      url: string;
      flightId?: string;
      hotelId?: string;
    },
  ) {
    return this.affiliateLinksService.create(
      body,
    );
  }

  // ======================================
  // 제휴 링크 조회
  // GET /affiliate-links/:id
  // ======================================

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.affiliateLinksService.findOne(
      id,
    );
  }
}