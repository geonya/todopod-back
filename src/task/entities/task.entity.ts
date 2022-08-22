import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsString, Length } from 'class-validator'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Photo } from '../../photo/entities/photo.entity'
import { Project } from '../../project/entities/project.entity'
import { Tag } from '../../tag/entities/tag.entity'
import { Todo } from '../../todo/entities/todo.entity'
import { User } from '../../user/entities/user.entity'

@InputType('TaskInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Task extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 20)
  name: string

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  description?: string

  @ManyToOne((type) => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @Field((type) => User)
  creator: User

  @RelationId((task: Task) => task.creator)
  creatorId: number

  @ManyToOne((type) => Project, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  project: Project

  @RelationId((task: Task) => task.project)
  @Field((type) => Int)
  projectId: number

  @Field((type) => [Todo], { nullable: true })
  @OneToMany((type) => Todo, (todo) => todo.user, { nullable: true })
  todos: Todo[]

  @Field((type) => [Tag], { nullable: true })
  @ManyToMany((type) => Tag, { eager: true, nullable: true })
  @JoinTable()
  tags?: Tag[]

  @Field((type) => [Photo], { nullable: true })
  @OneToMany((type) => Photo, (photo) => photo.task, { nullable: true })
  photos?: Photo[]
}
