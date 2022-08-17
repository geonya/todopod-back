import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
import { User } from '../user/entities/user.entity'
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo.dto'
import { DeleteTodoInput, DeleteTodoOutput } from './dtos/delete-todo.dto'
import { EditTodoInput, EditTodoOutput } from './dtos/edit-todo.dto'
import { GetTodoInput, GetTodoOutput } from './dtos/get-todo.dto'
import { GetTodosInput, GetTodosOutput } from './dtos/get-todos.dto'
import { Todo } from './entities/todo.entity'
import { TodoService } from './todo.service'

@Resolver((of) => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation((returns) => CreateTodoOutput)
  @Role(['Producer', 'Admin'])
  async createTodo(
    @AuthUser() user: User,
    @Args('input') createTodoInput: CreateTodoInput,
  ): Promise<CreateTodoOutput> {
    return this.todoService.createTodo(user, createTodoInput)
  }

  @Query((returns) => GetTodoOutput)
  @Role(['Producer', 'Admin'])
  async getTodo(
    @Args('input') getTodoInput: GetTodoInput,
  ): Promise<GetTodoOutput> {
    return this.todoService.getTodo(getTodoInput)
  }

  @Query((returns) => GetTodosOutput)
  @Role(['Producer', 'Admin'])
  async getTodos(
    @Args('input') getTodosInput: GetTodosInput,
  ): Promise<GetTodosOutput> {
    return this.todoService.getTodos(getTodosInput)
  }
  @Mutation((returns) => EditTodoOutput)
  @Role(['Producer', 'Admin'])
  async editTodo(
    @AuthUser() user: User,
    @Args('input') editTodoInput: EditTodoInput,
  ): Promise<EditTodoOutput> {
    return this.todoService.editTodo(user, editTodoInput)
  }

  @Mutation((returns) => DeleteTodoOutput)
  @Role(['Producer', 'Admin'])
  async deleteTodo(
    @AuthUser() user: User,
    @Args('input') deleteTodoInput: DeleteTodoInput,
  ): Promise<DeleteTodoOutput> {
    return this.todoService.deleteTodo(user, deleteTodoInput)
  }
}
