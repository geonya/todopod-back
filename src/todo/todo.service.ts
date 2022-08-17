import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/error-messages.constants'
import { TagRepository } from '../tag/repositories/tag.repository'
import { Task } from '../task/entities/task.entity'
import { User } from '../user/entities/user.entity'
import { TODOS_PER_PAGE } from './constants/todo.constants'
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo.dto'
import { DeleteTodoInput, DeleteTodoOutput } from './dtos/delete-todo.dto'
import { EditTodoInput, EditTodoOutput } from './dtos/edit-todo.dto'
import { GetTodoInput, GetTodoOutput } from './dtos/get-todo.dto'
import { GetTodosInput, GetTodosOutput } from './dtos/get-todos.dto'
import { Todo } from './entities/todo.entity'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todos: Repository<Todo>,
    @InjectRepository(Task)
    private readonly tasks: Repository<Task>,
    private readonly tags: TagRepository,
  ) {}

  async createTodo(
    user: User,
    createTodoInput: CreateTodoInput,
  ): Promise<CreateTodoOutput> {
    try {
      const task = await this.tasks.findOne({
        where: { id: createTodoInput.taskId },
      })
      if (!task) {
        return {
          ok: false,
          error: errorMessage.ko.task.notFound,
        }
      }
      if (user.id !== task.creatorId) {
        return {
          ok: false,
          error: errorMessage.ko.task.notAuthorized,
        }
      }
      const newTodo = this.todos.create(createTodoInput)
      newTodo.task = task
      newTodo.user = user
      if (createTodoInput.tagNames && createTodoInput.tagNames.length > 0) {
        const tags = await Promise.all(
          createTodoInput.tagNames.map(
            async (name) => await this.tags.getOrCreate(name),
          ),
        )
        newTodo.tags = tags
      }
      await this.todos.save(newTodo)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'createTodo',
      }
    }
  }

  async getTodo({ id }: GetTodoInput): Promise<GetTodoOutput> {
    try {
      const todo = await this.todos.findOne({
        where: { id },
        relations: ['user', 'task'],
      })
      if (!todo) {
        return {
          ok: false,
          error: errorMessage.ko.todo.notFound,
        }
      }
      return {
        ok: true,
        todo,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'getTodo',
      }
    }
  }
  async getTodos({ pages, taskId }: GetTodosInput): Promise<GetTodosOutput> {
    try {
      const task = await this.tasks.findOne({
        where: { id: taskId },
      })
      if (!task) {
        return {
          ok: false,
          error: errorMessage.ko.task.notFound,
        }
      }
      const todos = await this.todos.find({
        where: {
          task: {
            id: taskId,
          },
        },
        skip: (pages - 1) * TODOS_PER_PAGE,
        take: TODOS_PER_PAGE,
      })
      return {
        ok: true,
        todos,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'getTodos',
      }
    }
  }
  async editTodo(
    user: User,
    { id, payload, tagNames, process }: EditTodoInput,
  ): Promise<EditTodoOutput> {
    try {
      const todo = await this.todos.findOne({ where: { id: id } })
      if (!todo) {
        return {
          ok: false,
          error: errorMessage.ko.todo.notFound,
        }
      }
      if (user.id !== todo.userId) {
        return {
          ok: false,
          error: errorMessage.ko.todo.notAuthorized,
        }
      }
      if (payload) {
        todo.payload = payload
      }
      if (process) {
        todo.process = process
      }
      if (tagNames && tagNames.length > 0) {
        const tags = await Promise.all(
          tagNames.map(async (name) => await this.tags.getOrCreate(name)),
        )
        todo.tags = tags
      }
      await this.todos.save(todo)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'editTodo',
      }
    }
  }
  async deleteTodo(
    user: User,
    { id }: DeleteTodoInput,
  ): Promise<DeleteTodoOutput> {
    try {
      const todo = await this.todos.findOne({ where: { id: id } })
      if (!todo) {
        return {
          ok: false,
          error: errorMessage.ko.todo.notFound,
        }
      }
      if (todo.userId !== user.id) {
        return {
          ok: false,
          error: errorMessage.ko.todo.notAuthorized,
        }
      }
      await this.todos.delete(id)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'deleteTodo',
      }
    }
  }
}
