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
import { GetProjectsInput, GetProjectsOutput } from './dtos/get-projects.dto'
import { Project } from './entities/project.entity'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,

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
        const tagsArr = await Promise.all(
          createProjectInput.tagNames.map(async (name) => {
            const tag = await this.tags.getOrCreate(name)
            return tag
          }),
        )
        newProject.tags = tagsArr
      }
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
  async getProjects(
    getProjectsInput: GetProjectsInput,
  ): Promise<GetProjectsOutput> {
    try {
      // TODO pagination
      const projects = await this.projects.find()
      return {
        ok: true,
        projects,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'getProjects',
      }
    }
  }
}
