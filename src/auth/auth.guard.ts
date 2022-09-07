import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from '../user/entities/user.entity'
import { ALLOWED_ROLES, USER } from './auth.constants'
import { AllowedRoles } from './role.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<AllowedRoles>(
      ALLOWED_ROLES,
      context.getHandler(),
    )
    if (!roles) return true
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const { req } = gqlContext
    const user: User = req[USER]
    if (roles.includes('Any')) {
      return true
    }
    return roles.includes(user.role)
  }
}
