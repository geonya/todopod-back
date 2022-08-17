import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { isEnum, IsEnum } from 'class-validator'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Tag } from '../../tag/entities/tag.entity'
import { Task } from '../../task/entities/task.entity'
import { User } from '../../user/entities/user.entity'
enum ProcessEnum {
  ready = 'Ready',
  doing = 'Doing',
  done = 'Done',
}
registerEnumType(ProcessEnum, { name: 'ProcessEnum' })
@InputType('TodoInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Todo extends CoreEntity {
  @Column()
  @Field((type) => String)
  payload: string

  @Column({
    type: 'enum',
    enum: ProcessEnum,
    default: ProcessEnum.ready,
  })
  @Field((type) => ProcessEnum)
  @IsEnum(ProcessEnum)
  process: ProcessEnum

  @ManyToOne((type) => User, (user) => user.todos)
  @Field((type) => User)
  user: User

  @RelationId((todo: Todo) => todo.user)
  userId: number

  @ManyToOne((type) => Task, (task) => task.todos)
  @Field((type) => Task)
  task: Task

  @Field((type) => Int)
  @RelationId((todo: Todo) => todo.task)
  taskId: number

  @Field((type) => [Tag], { nullable: true })
  @ManyToMany((type) => Tag, { eager: true, nullable: true })
  @JoinTable()
  tags?: Tag[]
}
