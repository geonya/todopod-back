import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsString, Length } from 'class-validator'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Project } from '../../project/entities/project.entity'
import { Tag } from '../../tag/entities/tag.entity'
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

  @ManyToOne((type) => User, (user) => user.tasks)
  @Field((type) => User)
  creator: User

  @RelationId((task: Task) => task.creator)
  creatorId: number

  @ManyToOne((type) => Project, (project) => project.tasks)
  project: Project

  @RelationId((task: Task) => task.project)
  @Field((type) => Int)
  projectId: number

  @Field((type) => [Tag], { nullable: true })
  @ManyToMany((type) => Tag, { eager: true, nullable: true })
  @JoinTable()
  tags?: Tag[]
}
