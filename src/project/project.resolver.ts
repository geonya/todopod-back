import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
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
  @Role(['Any'])
  async getProjects(
    @Args('input')
    getProjectsInput: GetProjectsInput,
  ): Promise<GetProjectsOutput> {
    return this.projectService.getProjects(getProjectsInput)
  }

  @Query((returns) => GetProjectOutput)
  @Role(['Any'])
  async getProject(
    @AuthUser() user: User,
    @Args('input') getProjectInput: GetProjectInput,
  ): Promise<GetProjectOutput> {
    return this.projectService.getProject(user, getProjectInput)
  }

  @Mutation((returns) => CreateProjectOutput)
  @Role(['Producer'])
  async createProject(
    @AuthUser() creator: User,
    @Args('input') createProjectInput: CreateProjectInput,
  ): Promise<CreateProjectOutput> {
    return this.projectService.createProject(creator, createProjectInput)
  }

  @Mutation((returns) => EditProjectOutput)
  @Role(['Producer'])
  async editProject(
    @AuthUser() creator: User,
    @Args('input') editProjectInput: EditProjectInput,
  ): Promise<EditProjectOutput> {
    return this.projectService.editProject(creator, editProjectInput)
  }

  @Mutation((returns) => DeleteProjectOutput)
  @Role(['Producer'])
  async deleteProject(
    @AuthUser() creator: User,
    @Args('input') deleteProjectInput: DeleteProjectInput,
  ): Promise<EditProjectOutput> {
    return this.projectService.deleteProject(creator, deleteProjectInput)
  }
}
