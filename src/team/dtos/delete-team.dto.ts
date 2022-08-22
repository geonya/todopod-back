import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Team } from '../entities/team.entity'

@InputType('DeleteTeamInputType')
export class DeleteTeamInput extends PickType(Team, ['id']) {}

@ObjectType()
export class DeleteTeamOutput extends CoreOutput {}
