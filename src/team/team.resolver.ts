import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
import { User } from '../user/entities/user.entity'
import { CreateTeamInput, CreateTeamOutput } from './dtos/create-team.dto'
import { DeleteTeamInput, DeleteTeamOutput } from './dtos/delete-team.dto'
import { EditTeamInput, EditTeamOutput } from './dtos/edit-team.dto'
import { GetTeamInput, GetTeamOutput } from './dtos/get-team.dto'
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

  @Mutation((returns) => EditTeamOutput)
  @Role(['Producer', 'Admin'])
  async editTeam(
    @AuthUser() user: User,
    @Args('input') editTeamInput: EditTeamInput,
  ): Promise<EditTeamOutput> {
    return this.teamService.editTeam(user, editTeamInput)
  }

  @Query((returns) => GetTeamOutput)
  @Role(['Any'])
  async getTeam(
    @Args('input') getTeamInput: GetTeamInput,
  ): Promise<GetTeamOutput> {
    return this.teamService.getTeam(getTeamInput)
  }

  @Mutation((returns) => DeleteTeamOutput)
  @Role(['Producer', 'Admin'])
  async deleteTeam(
    @AuthUser() user: User,
    @Args('input') deleteTeamInput: DeleteTeamInput,
  ): Promise<DeleteTeamOutput> {
    return this.teamService.deleteTeam(user, deleteTeamInput)
  }
}
