import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { AuthGuard } from '../auth/auth.guard'
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
import { ProjectService } from './project.service'

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query((returns) => GetProjectsOutput)
  async getProjects(
    @Args('input') getProjectsInput: GetProjectsInput,
  ): Promise<GetProjectsOutput> {
    return this.projectService.getProjects(getProjectsInput)
  }

  @Query((returns) => GetProjectOutput)
  @UseGuards(AuthGuard)
  async getProject(
    @AuthUser() user: User,
    @Args('input') getProjectInput: GetProjectInput,
  ): Promise<GetProjectOutput> {
    return this.projectService.getProject(user, getProjectInput)
  }

  @Mutation((returns) => CreateProjectOutput)
  @UseGuards(AuthGuard)
  async createProject(
    @AuthUser() creator: User,
    @Args('input') createProjectInput: CreateProjectInput,
  ): Promise<CreateProjectOutput> {
    return this.projectService.createProject(creator, createProjectInput)
  }

  @Mutation((returns) => EditProjectOutput)
  @UseGuards(AuthGuard)
  async editProject(
    @AuthUser() creator: User,
    @Args('input') editProjectInput: EditProjectInput,
  ): Promise<EditProjectOutput> {
    return this.projectService.editProject(creator, editProjectInput)
  }

  @Mutation((returns) => DeleteProjectOutput)
  @UseGuards(AuthGuard)
  async deleteProject(
    @AuthUser() creator: User,
    @Args('input') deleteProjectInput: DeleteProjectInput,
  ): Promise<EditProjectOutput> {
    return this.projectService.deleteProject(creator, deleteProjectInput)
  }
}
