import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
import { User } from '../user/entities/user.entity'
import { CreateTaskInput, CreateTaskOutput } from './dtos/create-task.dto'
import { DeleteTaskInput, DeleteTaskOutput } from './dtos/delete-task.dto'
import { GetTaskInput, GetTaskOutput } from './dtos/get-task.dto'
import { GetTasksInput, GetTasksOutput } from './dtos/get-tasks.dto'
import { TaskService } from './task.service'

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation((returns) => CreateTaskOutput)
  @Role(['Producer', 'Admin'])
  createTask(
    @AuthUser() creator: User,
    @Args('input') createTaskInput: CreateTaskInput,
  ): Promise<CreateTaskOutput> {
    return this.taskService.createTask(creator, createTaskInput)
  }

  @Query((returns) => GetTasksOutput)
  @Role(['Producer', 'Admin'])
  getTasks(
    @Args('input') getTasksInput: GetTasksInput,
  ): Promise<GetTasksOutput> {
    return this.taskService.getTasks(getTasksInput)
  }

  @Query((returns) => GetTaskOutput)
  @Role(['Producer', 'Admin'])
  getTask(@Args('input') getTaskInput: GetTaskInput): Promise<GetTaskOutput> {
    return this.taskService.getTask(getTaskInput)
  }

  @Mutation((returns) => DeleteTaskOutput)
  @Role(['Producer', 'Admin'])
  deleteTask(
    @AuthUser() creator: User,
    @Args('input') deleteTaskInput: DeleteTaskInput,
  ): Promise<DeleteTaskOutput> {
    return this.taskService.deleteTask(creator, deleteTaskInput)
  }
}
