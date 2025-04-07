import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtservices: JwtService,
  ) {}

  async register(email: string, username: string, password: string) {
    try {
      const checkUsername = await this.prisma.users.findUnique({
        where: {
          username: username,
        },
      });
      const checkEmail = await this.prisma.users.findUnique({
        where: {
          email: email,
        },
      });

      if (checkEmail) {
        throw new BadRequestException('email already exist');
      }

      if (checkUsername) {
        throw new BadRequestException('username already exist');
      }

      const hashedPass = await bcrypt.hash(password, 10);
      console.log('hashed password:', hashedPass);

      const createdUser = await this.prisma.users.create({
        data: {
          email: email,
          username: username,
          password: hashedPass,
        },
      });

      return createdUser;
    } catch (error) {
      console.log('error on creating a user:', error);
      throw new BadRequestException(error.message);
    }
  }

  async login(email, password) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new BadRequestException('user doesnt exist');
      }
      if (!user.password) {
        throw new BadRequestException('Password is not set for this user');
      }

      console.log('your password:', password);
      console.log('hashed password:', user.password);
      const comparedPass = await bcrypt.compare(password, user.password);

      if (!comparedPass) {
        throw new BadRequestException('incorrect password');
      }
      const token = this.jwtservices.sign({ id: user.id });
      return token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUser(id) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id: id,
        },
      });

      if(!user){
        throw new BadRequestException('user doesnot exist');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
