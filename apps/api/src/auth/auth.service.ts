import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}


  // 회원가입
  async register(data: any) {

  console.log("1. register 시작");
  console.log(data);

  const hashedPassword = await bcrypt.hash(
    data.password,
    10,
  );

  console.log("2. bcrypt 완료");

  const user = await this.prisma.user.create({

    data: {
      email: data.email,
      password: hashedPassword,
      nickname: data.nickname,
    }

  });

  console.log("3. prisma 저장 완료");
  console.log(user);

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  };

}



// 로그인
async login(data:any){

  console.log("LOGIN DATA =", data);


  // 사용자 조회
  const user = await this.prisma.user.findUnique({

    where:{
      email:data.email,
    }

  });


  if(!user){

    throw new Error('사용자를 찾을 수 없습니다.');

  }



  // 비밀번호 확인
  const passwordCheck = await bcrypt.compare(

    data.password,

    user.password ?? ''

  );


  if(!passwordCheck){

    throw new Error('비밀번호가 틀렸습니다.');

  }



  // JWT 생성
const payload = {
  sub: user.id,
  email: user.email,
  nickname: user.nickname,
};

return {
  accessToken: this.jwtService.sign(payload),
  user: {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  },
};

}
}