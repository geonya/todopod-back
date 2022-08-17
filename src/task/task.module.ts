import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmExModule } from '../common/repositories/typeorm-ex-module'
import { Project } from '../project/entities/project.entity'
import { TagRepository } from '../tag/repositories/tag.repository'
import { Task } from './entities/task.entity'
import { TaskResolver } from './task.resolver'
import { TaskService } from './task.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project]),
    TypeOrmExModule.forCustomRepository([TagRepository]),
  ],
  providers: [TaskService, TaskResolver],
})
export class TaskModule {}
