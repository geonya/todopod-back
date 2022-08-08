import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account-dto';
import { GetUsersInput, GetUsersOutput } from './dtos/get-users.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // create account
  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const exsitingUser = await this.user.findOne({
        where: {
          email: createAccountInput.email,
        },
      });
      if (exsitingUser) {
        return {
          ok: false,
          error: 'User Already Exists!',
        };
      }
      await this.user.save(this.user.create({ ...createAccountInput }));
      return { ok: true };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error,
      };
    }
  }
  // create account

  // login
  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.user.findOne({
        where: {
          email: loginInput.email,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: 'User Not Found',
        };
      }
      const passwordCorrect = await user.checkPassword(loginInput.password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong Password',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Login Error',
      };
    }
  }
  // login

  // get user
  async getUser(getUsersInput: GetUsersInput): Promise<GetUsersOutput> {
    try {
      const users = await this.user.find({});
      return {
        ok: true,
        users,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error,
      };
    }
  }
  // get user
}
