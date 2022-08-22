import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/error-messages.constants'
import { User } from '../user/entities/user.entity'
import { CreateTeamInput, CreateTeamOutput } from './dtos/create-team.dto'
import { JoinTeamInput, JoinTeamOutput } from './dtos/join-team.dto'
import { Team } from './entities/team.entity'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teams: Repository<Team>,

    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async createTeam(
    user: User,
    { name }: CreateTeamInput,
  ): Promise<CreateTeamOutput> {
    try {
      const existingTeam = await this.teams.findOne({ where: { name } })
      if (existingTeam) {
        return {
          ok: false,
          error: errorMessage.ko.team.alreadyExisting,
        }
      }
      const team = this.teams.create({ name })
      team.leaderId = user.id
      const savedTeam = await this.teams.save(team)
      user.team = savedTeam
      await this.users.save(user)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'crateTeam',
      }
    }
  }

  async joinTeam(
    user: User,
    { id, name }: JoinTeamInput,
  ): Promise<JoinTeamOutput> {
    try {
      let team: Team
      if (id) {
        team = await this.teams.findOne({ where: { id }, relations: ['users'] })
      }
      if (name) {
        team = await this.teams.findOne({
          where: { name },
          relations: ['users'],
        })
      }
      if (!team) {
        return {
          ok: false,
          error: errorMessage.ko.team.notFound,
        }
      }
      if (team.id === user.teamId) {
        return {
          ok: false,
          error: errorMessage.ko.team.userExisting,
        }
      }
      user.team = team
      await this.users.save(user)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'joinTeam',
      }
    }
  }
}
