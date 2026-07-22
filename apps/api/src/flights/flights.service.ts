import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlightsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // ======================================
  // 항공편 직접 생성
  // POST /flights
  // ======================================

  async create(data: any) {
    return this.prisma.flight.create({
      data,
    });
  }

  // ======================================
  // Aviationstack 항공편 검색
  // GET /flights/search
  // ======================================

  async searchFlights(
    departure: string,
    arrival: string,
  ) {
    if (!departure || !arrival) {
      throw new BadRequestException(
        '출발지와 도착지를 입력해주세요.',
      );
    }

    const apiKey =
      process.env.AVIATIONSTACK_API_KEY;

    if (!apiKey) {
      throw new BadRequestException(
        'AVIATIONSTACK_API_KEY가 설정되지 않았습니다.',
      );
    }

    const url =
      `http://api.aviationstack.com/v1/flights` +
      `?access_key=${apiKey}` +
      `&dep_iata=${departure}` +
      `&arr_iata=${arrival}`;

    const response =
      await fetch(url);

    const result =
      await response.json();

    console.log(
      'Aviationstack 응답:',
      result,
    );

    if (!response.ok) {
      throw new BadRequestException(
        '항공편 검색에 실패했습니다.',
      );
    }

    if (result.error) {
      throw new BadRequestException(
        result.error.message ||
          'Aviationstack API 오류',
      );
    }

    return result;
  }

  // ======================================
  // 검색한 항공편을 여행에 저장
  // POST /flights/save
  // ======================================

  async saveFlight(
    tripId: string,
    data: {
      airline: string;
      departure: string;
      arrival: string;
      price?: number;
      provider?: string;
      externalOfferId?: string;
      departureAt?: Date;
      arrivalAt?: Date;
    },
  ) {
    // 여행 존재 여부 확인
    const trip =
      await this.prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

    if (!trip) {
      throw new NotFoundException(
        '여행을 찾을 수 없습니다.',
      );
    }

    // 필수 데이터 확인
    if (
      !data.airline ||
      !data.departure ||
      !data.arrival
    ) {
      throw new BadRequestException(
        '항공편 정보가 올바르지 않습니다.',
      );
    }

    // 동일 항공편 중복 저장 방지
    const existingFlight =
      await this.prisma.flight.findFirst({
        where: {
          tripId,

          airline:
            data.airline,

          departure:
            data.departure,

          arrival:
            data.arrival,

          externalOfferId:
            data.externalOfferId ??
            undefined,
        },
      });

    if (existingFlight) {
      return existingFlight;
    }

    return this.prisma.flight.create({
      data: {
        tripId,

        airline:
          data.airline,

        departure:
          data.departure,

        arrival:
          data.arrival,

        // Aviationstack 무료 검색 결과에는
        // 실제 가격이 없으므로 기본값 사용
        price:
          data.price ?? 0,

        provider:
          data.provider ??
          'AVIATIONSTACK',

        externalOfferId:
          data.externalOfferId ??
          null,

        departureAt:
          data.departureAt ??
          null,

        arrivalAt:
          data.arrivalAt ??
          null,
      },
    });
  }

  // ======================================
  // 전체 항공편 조회
  // GET /flights
  // ======================================

  findAll() {
  return this.prisma.flight.findMany({
    include: {
      trip: true,
    },
  });
}

  // ======================================
  // 항공편 단건 조회
  // GET /flights/:id
  // ======================================

  async findOne(id: string) {
    const flight =
      await this.prisma.flight.findUnique({
        where: {
          id,
        },

        include: {
          trip: true,
        },
      });

    if (!flight) {
      throw new NotFoundException(
        '항공편을 찾을 수 없습니다.',
      );
    }

    return flight;
  }

  // ======================================
  // 항공편 수정
  // PATCH /flights/:id
  // ======================================

  async update(
    id: string,
    data: any,
  ) {
    const flight =
      await this.prisma.flight.findUnique({
        where: {
          id,
        },
      });

    if (!flight) {
      throw new NotFoundException(
        '항공편을 찾을 수 없습니다.',
      );
    }

    return this.prisma.flight.update({
      where: {
        id,
      },

      data,
    });
  }

  // ======================================
  // 항공편 삭제
  // DELETE /flights/:id
  // ======================================

  async remove(id: string) {
    const flight =
      await this.prisma.flight.findUnique({
        where: {
          id,
        },
      });

    if (!flight) {
      throw new NotFoundException(
        '항공편을 찾을 수 없습니다.',
      );
    }

    return this.prisma.flight.delete({
      where: {
        id,
      },
    });
  }
}