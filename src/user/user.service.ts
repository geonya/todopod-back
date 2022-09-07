import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account-dto'
import { FindUserByIdOutput } from './dtos/find-user-by-id.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { User, UserRole } from './entities/user.entity'
import { JwtService } from '../jwt/jwt.service'
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto'
import {
  DeleteAccountInput,
  DeleteAccountOutput,
} from './dtos/delete-account.dto'
import errorMessage from '../common/constants/error-messages.constants'
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto'
import { Verification } from './entities/verification.entity'
import { EmailService } from '../email/email.service'
import { VERIFY_EMAIL_SUBJECT } from '../email/constants/send-email.constants'
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql'
import { CookieOptions, Request, Response } from 'express'
import { JWT_TOKEN } from '../jwt/jwt.constats'
import { LogoutOutput } from './dtos/logout.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly eMailService: EmailService,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const existingUser = await this.users.findOne({
        where: {
          email: createAccountInput.email,
        },
      })
      if (existingUser) {
        return {
          ok: false,
          error: errorMessage.ko.user.emailExisting,
        }
      }
      const user = await this.users.save(
        this.users.create({ ...createAccountInput }),
      )
      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      )
      await this.eMailService.sendEmail({
        subject: VERIFY_EMAIL_SUBJECT,
        to: 'geony@signpod.co.kr', // user.email
        template: 'email-verify',
        emailVars: {
          username: user.name,
          code: verification.code,
        },
      })
      return { ok: true }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'createAccount',
      }
    }
  }

  async login(
    loginInput: LoginInput,
    ctx: { res: Response; req: Request },
  ): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: { email: loginInput.email },
      })
      if (!user) {
        return {
          ok: false,
          error: errorMessage.ko.user.userNotFound,
        }
      }
      const passwordCorrect = await user.checkPassword(loginInput.password)
      if (!passwordCorrect) {
        return {
          ok: false,
          error: errorMessage.ko.user.passwordWrong,
        }
      }
      const token = this.jwtService.sign(user.id)

      // session cookie set
      const cookieOptions: CookieOptions = {
        // TODO - option setup
        domain: 'localhost',
        secure: false,
        path: '/',
      }
      ctx.res.cookie(JWT_TOKEN, token, cookieOptions)
      return {
        ok: true,
        token,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'login',
      }
    }
  }
  async logout(ctx: { res: Response; req: Request }): Promise<LogoutOutput> {
    try {
      ctx.res.clearCookie(JWT_TOKEN)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'Logout Error',
      }
    }
  }

  async findUserById(id: number): Promise<FindUserByIdOutput> {
    try {
      const user = await this.users.findOne({
        where: { id },
      })
      if (!user) {
        return {
          ok: false,
          error: errorMessage.ko.user.userNotFound,
        }
      }
      return {
        ok: true,
        user,
      }
    } catch (error) {
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'findUserById',
      }
    }
  }

  async getMyProfile(user: User) {
    if (!user) {
      return {
        ok: false,
        error: errorMessage.ko.user.notAuthorized,
      }
    }
    return {
      ok: true,
      user,
    }
  }

  async editAccount(
    id: number,
    { name, email, password, address, company, avatar, role }: EditAccountInput,
  ): Promise<EditAccountOutput> {
    try {
      const { user, error } = await this.findUserById(id)
      if (!user) {
        return {
          ok: false,
          error,
        }
      }
      if (name) {
        user.name = name
      }
      if (email) {
        const existingUser = await this.users.findOne({ where: { email } })
        if (existingUser) {
          return {
            ok: false,
            error: errorMessage.ko.user.emailExisting,
          }
        }
        user.email = email
        user.verified = false
        await this.verifications.delete({ user: { id } })
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        )
        await this.eMailService.sendEmail({
          subject: VERIFY_EMAIL_SUBJECT,
          to: 'geony@signpod.co.kr', // user.email
          template: 'email-verify',
          emailVars: {
            username: user.name,
            code: verification.code,
          },
        })
      }
      if (password) {
        user.password = password
      }
      if (address) {
        user.address = address
      }
      if (company) {
        user.company = company
      }
      if (avatar) {
        user.avatar = avatar
      }
      if (role) {
        user.role = role
      }
      await this.users.save(user)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'editAccount',
      }
    }
  }

  async deleteAccount(
    user: User,
    deleteAccountInput: DeleteAccountInput,
  ): Promise<DeleteAccountOutput> {
    try {
      if (user.role !== UserRole.Admin && user.id !== deleteAccountInput.id) {
        return {
          ok: false,
          error: errorMessage.ko.user.notAuthorized,
        }
      }
      const targetUser = await this.users.findOne({
        where: { id: deleteAccountInput.id },
      })
      if (!targetUser) {
        return {
          ok: false,
          error: errorMessage.ko.user.userNotFound,
        }
      }
      await this.users.delete(deleteAccountInput.id)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common + 'deleteAccount',
      }
    }
  }
  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: { user: true },
      })
      if (verification) {
        verification.user.verified = true
        await this.users.save(verification.user)
        await this.verifications.delete(verification.id)
        return {
          ok: true,
        }
      }
      return { ok: false, error: errorMessage.ko.verify.notFound }
    } catch (error) {
      console.error(error)
      return { ok: false, error: errorMessage.ko.common + 'verifyEmail' }
    }
  }
}
