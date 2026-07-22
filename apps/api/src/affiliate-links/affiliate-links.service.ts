import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AffiliateLinksService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // ======================================
  // 제휴 링크 생성
  // POST /affiliate-links
  // ======================================

  async create(data: {
    provider: string;
    type: string;
    url: string;
    flightId?: string;
    hotelId?: string;
  }) {
    if (!data.provider) {
      throw new BadRequestException(
        '제휴 플랫폼이 필요합니다.',
      );
    }

    if (!data.type) {
      throw new BadRequestException(
        '제휴 링크 타입이 필요합니다.',
      );
    }

    if (!data.url) {
      throw new BadRequestException(
        '제휴 링크 URL이 필요합니다.',
      );
    }

    // 항공편 또는 숙소 중 하나는 반드시 연결
    if (!data.flightId && !data.hotelId) {
      throw new BadRequestException(
        '항공편 또는 숙소를 연결해야 합니다.',
      );
    }

    // 항공편 존재 확인
    if (data.flightId) {
      const flight =
        await this.prisma.flight.findUnique({
          where: {
            id: data.flightId,
          },
        });

      if (!flight) {
        throw new NotFoundException(
          '항공편을 찾을 수 없습니다.',
        );
      }
    }

    // 숙소 존재 확인
    if (data.hotelId) {
      const hotel =
        await this.prisma.hotel.findUnique({
          where: {
            id: data.hotelId,
          },
        });

      if (!hotel) {
        throw new NotFoundException(
          '숙소를 찾을 수 없습니다.',
        );
      }
    }

    return this.prisma.affiliateLink.create({
      data: {
        provider: data.provider,
        type: data.type,
        url: data.url,
        flightId: data.flightId,
        hotelId: data.hotelId,
      },
    });
  }

  // ======================================
  // 제휴 링크 조회
  // GET /affiliate-links/:id
  // ======================================

  async findOne(id: string) {
    const affiliateLink =
      await this.prisma.affiliateLink.findUnique({
        where: {
          id,
        },
        include: {
          flight: true,
          hotel: true,
        },
      });

    if (!affiliateLink) {
      throw new NotFoundException(
        '제휴 링크를 찾을 수 없습니다.',
      );
    }

    return affiliateLink;
  }

  // ======================================
  // 클릭 수 증가
  // GET /affiliate-links/:id/click
  // ======================================

  async click(id: string) {
    const affiliateLink =
      await this.prisma.affiliateLink.findUnique({
        where: {
          id,
        },
      });

    if (!affiliateLink) {
      throw new NotFoundException(
        '제휴 링크를 찾을 수 없습니다.',
      );
    }

    const updated =
      await this.prisma.affiliateLink.update({
        where: {
          id,
        },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });

    return {
      url: updated.url,
      clicks: updated.clicks,
    };
  }
}