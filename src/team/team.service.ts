import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ok } from 'assert'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/error-messages.constants'
import { User, UserRole } from '../user/entities/user.entity'
import { CreateTeamInput, CreateTeamOutput } from './dtos/create-team.dto'
import { DeleteTeamInput, DeleteTeamOutput } from './dtos/delete-team.dto'
import { EditTeamInput, EditTeamOutput } from './dtos/edit-team.dto'
import { GetTeamInput, GetTeamOutput } from './dtos/get-team.dto'
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
  async editTeam(
    user: User,
    editTeamInput: EditTeamInput,
  ): Promise<EditTeamOutput> {
    try {
      const team = await this.teams.findOne({ where: { id: editTeamInput.id } })
      if (!team) {
        return {
          ok: false,
          error: errorMessage.ko.team.notFound,
        }
      }
      if (team.leaderId !== user.id) {
        return {
          ok: false,
          error: errorMessage.ko.common.notAuthorized,
        }
      }
      if (editTeamInput.name) {
        const existingTeam = await this.teams.findOne({
          where: {
            name: editTeamInput.name,
          },
        })
        if (existingTeam) {
          return {
            ok: false,
            error: errorMessage.ko.team.alreadyExisting,
          }
        }
        team.name = editTeamInput.name
      }
      if (editTeamInput.inviteUserId) {
        const user = await this.users.findOne({
          where: {
            id: editTeamInput.inviteUserId,
          },
        })
        if (!user) {
          return {
            ok: false,
            error: errorMessage.ko.user.userNotFound,
          }
        }
        if (user.role !== UserRole.Producer) {
          return {
            ok: false,
            error: errorMessage.ko.team.notAcceptedRole,
          }
        }
        if (user.teamId === editTeamInput.id) {
          return {
            ok: false,
            error: errorMessage.ko.team.userExisting,
          }
        }
        user.team = team
        await this.users.save(user)
      }
      if (editTeamInput.withdrawMemberId) {
        const user = await this.users.findOne({
          where: {
            id: editTeamInput.withdrawMemberId,
            teamId: editTeamInput.id,
          },
        })
        if (!user) {
          return {
            ok: false,
            error: errorMessage.ko.user.userNotFound,
          }
        }
        user.team = null
        await this.users.save(user)
      }
      if (editTeamInput.leaderId) {
        team.leaderId = editTeamInput.leaderId
      }
      await this.teams.save(team)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'editTeam',
      }
    }
  }
  async getTeam({ id, name }: GetTeamInput): Promise<GetTeamOutput> {
    try {
      const team = await this.teams.findOne({
        ...(id && { where: { id } }),
        ...(name && { where: { name } }),
        relations: ['users'],
      })
      if (!team) {
        return {
          ok: false,
          error: errorMessage.ko.team.notFound,
        }
      }
      return {
        ok: true,
        team,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'getTeam',
      }
    }
  }
  async deleteTeam(
    user: User,
    deleteTeamInput: DeleteTeamInput,
  ): Promise<DeleteTeamOutput> {
    try {
      const team = await this.teams.findOne({
        where: { id: deleteTeamInput.id },
      })
      if (!team) {
        return {
          ok: false,
          error: errorMessage.ko.team.notFound,
        }
      }
      if (team.leaderId !== user.id) {
        return {
          ok: false,
          error: errorMessage.ko.team.notAuthorized,
        }
      }

      await this.teams.delete(deleteTeamInput.id)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'deleteTeam',
      }
    }
  }
}
