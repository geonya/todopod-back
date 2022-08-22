import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Team } from '../entities/team.entity'

@InputType('CreateTeamInputType')
export class CreateTeamInput extends PickType(Team, ['name']) {}

@ObjectType()
export class CreateTeamOutput extends CoreOutput {}
