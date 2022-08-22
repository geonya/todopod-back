import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
import { User } from '../user/entities/user.entity'
import { CreateTeamInput, CreateTeamOutput } from './dtos/create-team.dto'
import { JoinTeamInput, JoinTeamOutput } from './dtos/join-team.dto'
import { Team } from './entities/team.entity'
import { TeamService } from './team.service'

@Resolver((of) => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Mutation((returns) => CreateTeamOutput)
  @Role(['Producer', 'Admin'])
  async createTeam(
    @AuthUser() user: User,
    @Args('input') createTeamInput: CreateTeamInput,
  ): Promise<CreateTeamOutput> {
    return this.teamService.createTeam(user, createTeamInput)
  }

  @Mutation((returns) => CreateTeamOutput)
  @Role(['Producer', 'Admin'])
  async joinTeam(
    @AuthUser() user: User,
    @Args('input') joinTeamInput: JoinTeamInput,
  ): Promise<JoinTeamOutput> {
    return this.teamService.joinTeam(user, joinTeamInput)
  }
}
