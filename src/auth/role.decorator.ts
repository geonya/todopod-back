import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../user/entities/user.entity'
import { ALLOWED_ROLES } from './auth.constants'

export type AllowedRoles = keyof typeof UserRole | 'Any'

export const Role = (roles: AllowedRoles[]) => SetMetadata(ALLOWED_ROLES, roles)
