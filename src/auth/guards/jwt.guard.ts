import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export class JwtGuards implements CanActivate {
  constructor(private readonly jwtservices: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['token'];
    console.log('represnted token', token);
    if (!token) {
      throw new BadRequestException('not authonticated');
    }

    try {
      const decode = this.jwtservices.verify(token);
      request.user = decode;

      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
