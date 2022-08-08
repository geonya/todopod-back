import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account-dto';
import { GetUsersInput, GetUsersOutput } from './dtos/get-users.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}
  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const exsitingUser = await this.user.findOne({
        where: {
          name: createAccountInput.name,
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
}
