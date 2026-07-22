import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PrismaModule } from '../prisma/prisma.module';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt/jwt-strategy/jwt-strategy.service';


@Module({

  imports:[

    PrismaModule,

    PassportModule,

    JwtModule.register({

      secret:
        process.env.JWT_SECRET || 'trippilot-secret-key',

      signOptions:{
        expiresIn:'7d',
      },

    }),

  ],


  controllers:[

    AuthController,

  ],


  providers:[

    AuthService,

    JwtStrategy,

  ],


  exports:[

    AuthService,

  ],

})
export class AuthModule {}