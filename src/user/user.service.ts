import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account-dto';
import { FindUserByIdOutput } from './dtos/find-user-by-id.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const existingUser = await this.user.findOne({
        where: {
          email: createAccountInput.email,
        },
      });
      if (existingUser) {
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
        error: 'Create Account Internal Error',
      };
    }
  }

  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.user.findOne({
        where: { email: loginInput.email },
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

  async findUserById(id: number): Promise<FindUserByIdOutput> {
    try {
      const user = await this.user.findOne({
        where: { id },
      });
      if (!user) {
        return {
          ok: false,
          error: 'Not found user',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'FindUserById Internal Error',
      };
    }
  }

  async getMyProfile(user: User) {
    if (!user) {
      return {
        ok: false,
        error: 'Not Athorized',
      };
    }
    return {
      ok: true,
      user,
    };
  }

  async editAccount(
    id: number,
    { name, email, password, address, company, avatar, role }: EditAccountInput,
  ): Promise<EditAccountOutput> {
    try {
      const { user, error } = await this.findUserById(id);
      if (!user) {
        return {
          ok: false,
          error,
        };
      }
      if (name) {
        user.name = name;
      }
      if (email) {
        const emailUser = await this.user.findOne({ where: { email } });
        if (emailUser) {
          return {
            ok: false,
            error: 'Email is Already exists',
          };
        }
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      if (address) {
        user.address = address;
      }
      if (company) {
        user.company = company;
      }
      if (avatar) {
        user.avatar = avatar;
      }
      if (role) {
        user.role = role;
      }
      await this.user.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Edit Account Internal Error',
      };
    }
  }
}
