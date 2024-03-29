import { Injectable, NestMiddleware } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as cookieParser from 'cookie-parser'
import { NextFunction, Request } from 'express'
import { USER } from '../auth/auth.constants'
import { UserService } from '../user/user.service'
import { JWT_TOKEN } from './jwt.constats'
import { JwtService } from './jwt.service'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (JWT_TOKEN in req.cookies) {
      const token = req.cookies[JWT_TOKEN]
      try {
        const decoded = this.jwtService.verify(token)
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user } = await this.userService.findUserById(decoded['id'])
          req[USER] = user
        }
      } catch (error) {
        console.error(error)
      }
    }
    next()
  }
}
