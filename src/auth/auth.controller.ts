import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { retry, throwError } from 'rxjs';
import { JwtGuards } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() req, @Res() res: Response) {
    const { email, username, password } = req;
    try {
      const user = await this.authService.register(email, username, password);

      return res.json({
        user: user,
        message: 'user registration is successfull',
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  @Post('login')
  async login(@Body() req, @Res() res: Response) {
    const { email, password } = req;
    try {
      const token = await this.authService.login(email, password);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.json({
        message: 'login successfully',
      });
    } catch (error) {
      return res.json({
        message: error.message,
      });
    }
  }

  @Get('me')
  @UseGuards(JwtGuards)
  async getUser(@Req() req: Request) {
    try {
      const user = req.user as any;
      const id = user.id;
      return await this.authService.getUser(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
