import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmExModule } from '../common/repositories/typeorm-ex-module'
import { TagRepository } from '../tag/repositories/tag.repository'
import { Task } from '../task/entities/task.entity'
import { Todo } from './entities/todo.entity'
import { TodoResolver } from './todo.resolver'
import { TodoService } from './todo.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, Task]),
    TypeOrmExModule.forCustomRepository([TagRepository]),
  ],
  providers: [TodoService, TodoResolver],
})
export class TodoModule {}
