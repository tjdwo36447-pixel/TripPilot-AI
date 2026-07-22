import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AiService } from './ai.service';

import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('ai')
@UseGuards(JwtGuard)
export class AiController {
  constructor(
    private aiService: AiService,
  ) {}

  @Post()
  createPlan(
    @Req() req,

    @Body() body: any,
  ) {
    console.log(
      'LOGIN USER =',
      req.user,
    );

    return this.aiService.createPlan(
      body,

      req.user,
    );
  }
}