import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,

    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey:
        this.configService.get<string>(
          'OPENAI_API_KEY',
        ),
    });
  }

  async createPlan(
    body: any,

    userPayload: any,
  ) {
    console.log('AI REQUEST RECEIVED');
  console.log('BODY:', body);
  console.log('USER:', userPayload);
    // ======================================
    // 1. 필수 데이터 확인
    // ======================================

    if (!body.country) {
      throw new BadRequestException(
        '국가를 입력해주세요.',
      );
    }

    if (!body.city) {
      throw new BadRequestException(
        '도시를 입력해주세요.',
      );
    }

    if (!body.startDate) {
      throw new BadRequestException(
        '여행 시작일을 입력해주세요.',
      );
    }

    if (!body.endDate) {
      throw new BadRequestException(
        '여행 종료일을 입력해주세요.',
      );
    }

    if (!body.days || body.days <= 0) {
      throw new BadRequestException(
        '여행 기간이 올바르지 않습니다.',
      );
    }

    if (!body.budget || body.budget <= 0) {
      throw new BadRequestException(
        '예산이 올바르지 않습니다.',
      );
    }

    // ======================================
    // 2. 날짜 검증
    // ======================================

    const startDate =
      new Date(
        `${body.startDate}T00:00:00`,
      );

    const endDate =
      new Date(
        `${body.endDate}T00:00:00`,
      );

    if (
      isNaN(
        startDate.getTime(),
      )
    ) {
      throw new BadRequestException(
        '여행 시작일이 올바르지 않습니다.',
      );
    }

    if (
      isNaN(
        endDate.getTime(),
      )
    ) {
      throw new BadRequestException(
        '여행 종료일이 올바르지 않습니다.',
      );
    }

    if (
      endDate < startDate
    ) {
      throw new BadRequestException(
        '여행 종료일은 시작일보다 빠를 수 없습니다.',
      );
    }

    // ======================================
    // 3. AI Prompt
    // ======================================

    const prompt = `
다음 조건으로 여행 계획을 JSON만 출력하세요.

국가: ${body.country}
도시: ${body.city}

여행 시작일: ${body.startDate}
여행 종료일: ${body.endDate}
여행일수: ${body.days}일

예산: ${body.budget}원
스타일: ${body.style}

중요한 규칙:

1. 여행 일정은 반드시 ${body.days}일에 맞춰 생성하세요.

2. 일정의 date는 여행 시작일부터 하루씩 증가해야 합니다.

3. 첫 번째 일정의 날짜는 반드시 ${body.startDate}입니다.

4. 마지막 일정의 날짜는 반드시 ${body.endDate}입니다.

5. 항공권과 숙소 가격은 반드시 숫자로 입력하세요.

6. 가격은 0이 될 수 없습니다.

7. expenses의 amount도 반드시 숫자로 입력하세요.

8. JSON 이외의 설명은 절대 출력하지 마세요.

반드시 아래 형태의 JSON만 출력하세요.

{
  "title": "",
  "hotel": "",
  "hotelPrice": 500000,
  "flight": "",
  "flightPrice": 300000,
  "schedules": [
    {
      "date": "YYYY-MM-DD",
      "place": "",
      "description": ""
    }
  ],
  "expenses": [
    {
      "category": "",
      "amount": 0
    }
  ]
}
`;

    // ======================================
    // 4. GPT 호출
    // ======================================

    const response =
      await this.openai.responses.create({
        model: 'gpt-5-mini',

        input: prompt,
      });

    console.log(
      'AI 응답:',
      response.output_text,
    );

    // ======================================
    // 5. JSON 변환
    // ======================================

    let plan: any;

    try {
      plan = JSON.parse(
        response.output_text,
      );
    } catch (error) {
      throw new BadRequestException(
        'AI 응답을 JSON으로 변환할 수 없습니다.',
      );
    }

    // ======================================
    // 6. User 조회
    // ======================================

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userPayload.id,
        },
      });

    if (!user) {
      throw new BadRequestException(
        'User가 없습니다.',
      );
    }

    // ======================================
    // 7. Transaction
    // ======================================

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          // ==================================
          // Trip 저장
          // ==================================

          const trip =
            await tx.trip.create({
              data: {
                title:
                  plan.title,

                startDate,

                endDate,

                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });

          // ==================================
          // Schedule 저장
          // ==================================

          for (
            const schedule of plan.schedules
          ) {
            const scheduleDate =
              new Date(
                `${schedule.date}T00:00:00`,
              );

            await tx.schedule.create({
              data: {
                date:
                  scheduleDate,

                place:
                  schedule.place,

                description:
                  schedule.description,

                trip: {
                  connect: {
                    id: trip.id,
                  },
                },
              },
            });
          }

          // ==================================
          // Flight 저장
          // ==================================

          await tx.flight.create({
            data: {
              airline:
                plan.flight,

              departure:
                body.country,

              arrival:
                body.city,

              price:
                Number(
                  plan.flightPrice,
                ),

              trip: {
                connect: {
                  id: trip.id,
                },
              },
            },
          });

          // ==================================
          // Hotel 저장
          // ==================================

          await tx.hotel.create({
            data: {
              name:
                plan.hotel,

              price:
                Number(
                  plan.hotelPrice,
                ),

              trip: {
                connect: {
                  id: trip.id,
                },
              },
            },
          });

          // ==================================
          // Expense 저장
          // ==================================

          for (
            const expense of plan.expenses
          ) {
            await tx.expense.create({
              data: {
                category:
                  expense.category,

                amount:
                  Number(
                    expense.amount,
                  ),

                trip: {
                  connect: {
                    id: trip.id,
                  },
                },
              },
            });
          }

          return {
            trip,

            plan,
          };
        },
      );

    // ======================================
    // 8. 결과 반환
    // ======================================

    return {
      message:
        '여행이 생성되었습니다.',

      ...result,
    };
  }
}