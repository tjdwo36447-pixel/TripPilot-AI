import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(
    private readonly flightsService: FlightsService,
  ) {}

  // ======================================
  // 항공편 검색
  // GET /flights/search
  // ======================================

  @Get('search')
  search(
    @Query('departure')
    departure: string,

    @Query('arrival')
    arrival: string,
  ) {
    return this.flightsService.searchFlights(
      departure,
      arrival,
    );
  }

  // ======================================
  // 검색 항공편을 Trip에 저장
  // POST /flights/save
  // ======================================

  @Post('save')
  saveFlight(
    @Body() body: any,
  ) {
    return this.flightsService.saveFlight(
      body.tripId,
      {
        airline:
          body.airline,

        departure:
          body.departure,

        arrival:
          body.arrival,

        price:
          body.price,

        provider:
          body.provider,

        externalOfferId:
          body.externalOfferId,

        departureAt:
          body.departureAt
            ? new Date(
                body.departureAt,
              )
            : undefined,

        arrivalAt:
          body.arrivalAt
            ? new Date(
                body.arrivalAt,
              )
            : undefined,
      },
    );
  }

  // ======================================
  // 항공편 직접 생성
  // POST /flights
  // ======================================

  @Post()
  create(
    @Body() body: any,
  ) {
    return this.flightsService.create(
      body,
    );
  }

  // ======================================
  // 전체 항공편
  // GET /flights
  // ======================================

  @Get()
  findAll() {
    return this.flightsService.findAll();
  }

  // ======================================
  // 항공편 상세
  // GET /flights/:id
  // ======================================

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.flightsService.findOne(
      id,
    );
  }

  // ======================================
  // 항공편 수정
  // PATCH /flights/:id
  // ======================================

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    body: any,
  ) {
    return this.flightsService.update(
      id,
      body,
    );
  }

  // ======================================
  // 항공편 삭제
  // DELETE /flights/:id
  // ======================================

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.flightsService.remove(
      id,
    );
  }
}