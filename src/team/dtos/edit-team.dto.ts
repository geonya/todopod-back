import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Team } from '../entities/team.entity'

@InputType('EditTeamInputType')
export class EditTeamInput extends PartialType(
  PickType(Team, ['id', 'name', 'leaderId']),
) {
  @Field((type) => Int, { nullable: true })
  inviteUserId?: number

  @Field((type) => Int, { nullable: true })
  withdrawMemberId?: number
}

@ObjectType()
export class EditTeamOutput extends CoreOutput {}
