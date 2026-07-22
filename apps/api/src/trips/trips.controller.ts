import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { TripsService } from './trips.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';


@Controller('trips')
@UseGuards(JwtGuard)
export class TripsController {


  constructor(
    private tripsService: TripsService,
  ) {}



  // 여행 생성
  @Post()
  create(
    @Body() body:any,
    @Req() req,
  ){

    return this.tripsService.create({

      ...body,

      userId:req.user.id,

      startDate:new Date(body.startDate),

      endDate:new Date(body.endDate),

    });

  }



  // 내 여행 목록 조회
  @Get()
findAll(
  @Req() req,
) {
  console.log("========== GET /trips ==========");
  console.log("JWT USER =", req.user);
  console.log("JWT USER ID =", req.user.id);

  return this.tripsService.findAll(
    req.user.id
  );
}



  // 내 여행 상세 조회
  @Get(':id')
  findOne(
    @Param('id') id:string,
    @Req() req,
  ){

    return this.tripsService.findOne(
      id,
      req.user.id
    );

  }



  // 여행 수정
  @Patch(':id')
  update(
    @Param('id') id:string,
    @Body() body:any,
    @Req() req,
  ){

    return this.tripsService.update(
      id,
      req.user.id,
      body,
    );

  }



  // 여행 삭제
  @Delete(':id')
  remove(
    @Param('id') id:string,
    @Req() req,
  ){

    return this.tripsService.remove(
      id,
      req.user.id,
    );

  }


}