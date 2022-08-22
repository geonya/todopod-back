import { Field, InputType, ObjectType } from '@nestjs/graphql'
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
import { Tag } from '../../tag/entities/tag.entity'
import { Task } from '../../task/entities/task.entity'
import { User } from '../../user/entities/user.entity'
import { Comment } from './comment.entity'

@InputType('ProjectInputType', { isAbstract: true })
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

  @ManyToOne((type) => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @Field((type) => User)
  creator: User

  @RelationId((project: Project) => project.creator)
  creatorId: number

  @Field((type) => [Task], { nullable: true })
  @OneToMany((type) => Task, (task) => task.project, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  tasks?: Task[]

  @Field((type) => [Comment], { nullable: true })
  @OneToMany((type) => Comment, (comment) => comment.project, {
    nullable: true,
  })
  comments?: Comment[]

  @Field((type) => [Tag])
  @ManyToMany((type) => Tag, { eager: true })
  @JoinTable()
  tags: Tag[]

  @Field((type) => [Photo], { nullable: true })
  @OneToMany((type) => Photo, (photo) => photo.project, { nullable: true })
  photos: Photo[]
}
