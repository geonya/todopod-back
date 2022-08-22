import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Team } from '../entities/team.entity'

@InputType('GetTeamInputType')
export class GetTeamInput extends PartialType(PickType(Team, ['id', 'name'])) {}

@ObjectType()
export class GetTeamOutput extends CoreOutput {
  @Field((type) => Team, { nullable: true })
  team?: Team
}
