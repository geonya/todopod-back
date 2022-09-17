import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/error-messages.constants'
import { TagRepository } from '../tag/repositories/tag.repository'
import { User } from '../user/entities/user.entity'
import {
  CreateProjectInput,
  CreateProjectOutput,
} from './dtos/create-project.dto'
import {
  DeleteProjectInput,
  DeleteProjectOutput,
} from './dtos/delete-project.dto'
import { EditProjectInput, EditProjectOutput } from './dtos/edit-project.dto'
import { GetProjectInput, GetProjectOutput } from './dtos/get-project.dto'
import { GetProjectsInput, GetProjectsOutput } from './dtos/get-projects.dto'
import { Project } from './entities/project.entity'
import { PROJECTS_PER_PAGE } from './project.constants'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly tags: TagRepository,
  ) {}

  async createProject(
    creator: User,
    createProjectInput: CreateProjectInput,
  ): Promise<CreateProjectOutput> {
    try {
      const newProject = this.projects.create(createProjectInput)
      newProject.creator = creator
      if (
        createProjectInput.tagNames &&
        createProjectInput.tagNames.length > 0
      ) {
        const tags = await Promise.all(
          createProjectInput.tagNames.map(
            async (name) => await this.tags.getOrCreate(name),
          ),
        )
        newProject.tags = tags
      }
      newProject.members = [creator]
      await this.projects.save(newProject)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'createProject',
      }
    }
  }

  async editProject(
    user: User,
    editProjectInput: EditProjectInput,
  ): Promise<EditProjectOutput> {
    try {
      const project = await this.projects.findOne({
        where: {
          id: editProjectInput.id,
        },
      })
      if (!project) {
        return {
          ok: false,
          error: errorMessage.ko.project.notFound,
        }
      }
      if (project.creatorId !== user.id) {
        return {
          ok: false,
          error: errorMessage.ko.project.notAuthorized,
        }
      }
      if (editProjectInput.tagNames && editProjectInput.tagNames.length > 0) {
        const tagsArr = await Promise.all(
          editProjectInput.tagNames.map(async (name) => {
            const tag = await this.tags.getOrCreate(name)
            return tag
          }),
        )
        project.tags = tagsArr
      }
      if (editProjectInput.inviteUserId) {
        const user = await this.users.findOne({
          where: {
            id: editProjectInput.inviteUserId,
          },
        })
        if (!user) {
          return {
            ok: false,
            error: errorMessage.ko.user.userNotFound,
          }
        }
        project.members = [...project.members, user]
      }
      if (editProjectInput.withdrawUserId) {
        if (project.creatorId === editProjectInput.withdrawUserId) {
          return {
            ok: false,
            error: errorMessage.ko.project.thisIsCreator,
          }
        }
        const user = await this.users.findOne({
          where: {
            id: editProjectInput.withdrawUserId,
          },
        })
        if (!user) {
          return {
            ok: false,
            error: errorMessage.ko.user.userNotFound,
          }
        }

        if (
          project.members.findIndex((member) => member.id === user.id) === -1
        ) {
          return {
            ok: false,
            error: errorMessage.ko.project.notMember,
          }
        }
        project.members = project.members.filter(
          (member) => member.id !== user.id,
        )
      }
      await this.projects.save({
        ...project,
        ...editProjectInput,
      })
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'editProject',
      }
    }
  }

  async deleteProject(
    user: User,
    deleteProjectInput: DeleteProjectInput,
  ): Promise<DeleteProjectOutput> {
    try {
      const project = await this.projects.findOne({
        where: { id: deleteProjectInput.id },
      })
      if (!project) {
        return {
          ok: false,
          error: errorMessage.ko.project.notFound,
        }
      }
      if (user.id !== project.creatorId) {
        return {
          ok: false,
          error: errorMessage.ko.project.notAuthorized,
        }
      }
      await this.projects.delete(deleteProjectInput.id)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'deleteProject',
      }
    }
  }

  async getProjects(
    getProjectsInput: GetProjectsInput,
  ): Promise<GetProjectsOutput> {
    try {
      if (getProjectsInput.page < 1) {
        return {
          ok: false,
          error: errorMessage.ko.common.pageNumberError,
        }
      }
      const [projects, totalProjectsCount] = await this.projects.findAndCount({
        skip: (getProjectsInput.page - 1) * PROJECTS_PER_PAGE,
        take: PROJECTS_PER_PAGE,
        order: { createdAt: 'DESC' },
      })
      return {
        ok: true,
        projects,
        totalProjectsCount,
        totalPages: Math.ceil(totalProjectsCount / PROJECTS_PER_PAGE),
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'getProjects',
      }
    }
  }

  async getProject(
    user: User,
    getProjectInput: GetProjectInput,
  ): Promise<GetProjectOutput> {
    try {
      const project = await this.projects.findOne({
        where: { id: getProjectInput.id },
      })
      if (!project) {
        return {
          ok: false,
          error: errorMessage.ko.project.notFound,
        }
      }
      // if (user.id !== project.creatorId) {
      //   return {
      //     ok: false,
      //     error: errorMessage.ko.project.notAuthorized,
      //   }
      // }
      return {
        ok: true,
        project,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'getProject',
      }
    }
  }
}
