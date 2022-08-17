import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/error-messages.constants'
import { Project } from '../project/entities/project.entity'
import { TagRepository } from '../tag/repositories/tag.repository'
import { User } from '../user/entities/user.entity'
import { TASKS_PER_PAGE } from './constants/task.constants'
import { CreateTaskInput, CreateTaskOutput } from './dtos/create-task.dto'
import { GetTasksInput, GetTasksOutput } from './dtos/get-tasks.dto'
import { Task } from './entities/task.entity'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly tasks: Repository<Task>,
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,

    private readonly tags: TagRepository,
  ) {}
  async createTask(
    creator: User,
    createTaskInput: CreateTaskInput,
  ): Promise<CreateTaskOutput> {
    try {
      const newTask = this.tasks.create(createTaskInput)
      newTask.creator = creator
      if (createTaskInput.tagsName && createTaskInput.tagsName.length > 0) {
        const tags = await Promise.all(
          createTaskInput.tagsName.map(
            async (name) => await this.tags.getOrCreate(name),
          ),
        )
        newTask.tags = tags
      }
      const project = await this.projects.findOne({
        where: {
          id: createTaskInput.projectId,
        },
      })
      if (!project) {
        return {
          ok: false,
          error: errorMessage.ko.project.notFound,
        }
      }
      newTask.project = project
      await this.tasks.save(newTask)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error,
      }
    }
  }

  async getTasks({ projectId, pages }: GetTasksInput): Promise<GetTasksOutput> {
    try {
      const project = await this.projects.findOne({
        where: { id: projectId },
      })
      if (!project) {
        return {
          ok: false,
          error: errorMessage.ko.project.notFound,
        }
      }
      const tasks = await this.tasks.find({
        where: {
          project: {
            id: projectId,
          },
        },
        skip: (pages - 1) * TASKS_PER_PAGE,
        take: TASKS_PER_PAGE,
      })
      return {
        ok: true,
        tasks,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'getTasks',
      }
    }
  }
}
