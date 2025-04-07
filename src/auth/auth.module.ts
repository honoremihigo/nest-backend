import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
