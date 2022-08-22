import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Team } from '../entities/team.entity'

@InputType('JoinTeamInputType')
export class JoinTeamInput extends PartialType(
  PickType(Team, ['id', 'name']),
) {}

@ObjectType()
export class JoinTeamOutput extends CoreOutput {}
