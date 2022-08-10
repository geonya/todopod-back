import { Field, InputType, ObjectType } from '@nestjs/graphql'
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
import { Tag } from '../../tag/entities/tag.entity'
import { User } from '../../user/entities/user.entity'

@InputType('ProjectInputType')
@ObjectType()
@Entity()
export class Project extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 20)
  title: string

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  description?: string

  @ManyToOne((type) => User, (user) => user.projects)
  @Field((type) => User)
  creator: User

  @RelationId((project: Project) => project.creator)
  creatorId: number

  @Field((type) => [Tag])
  @ManyToMany((type) => Tag, { eager: true })
  @JoinTable()
  tags: Tag[]
}
