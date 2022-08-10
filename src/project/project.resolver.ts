import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { AuthGuard } from '../auth/auth.guard'
import { User } from '../user/entities/user.entity'
import {
  CreateProjectInput,
  CreateProjectOutput,
} from './dtos/create-project.dto'
import { GetProjectsInput, GetProjectsOutput } from './dtos/get-projects.dto'
import { Project } from './entities/project.entity'
import { ProjectService } from './project.service'

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query((returns) => GetProjectsOutput)
  @UseGuards(AuthGuard)
  async getProjects(
    @Args('input') getProjectsInput: GetProjectsInput,
  ): Promise<GetProjectsOutput> {
    return this.projectService.getProjects(getProjectsInput)
  }

  @Mutation((returns) => CreateProjectOutput)
  @UseGuards(AuthGuard)
  async createProject(
    @AuthUser() creator: User,
    @Args('input') createProjectInput: CreateProjectInput,
  ): Promise<CreateProjectOutput> {
    return this.projectService.createProject(creator, createProjectInput)
  }
}
