import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString, Length } from 'class-validator'
import { Column, Entity, ManyToOne, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { User } from '../../user/entities/user.entity'
import { Project } from './project.entity'

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 100)
  caption: string

  @ManyToOne((type) => User, (user) => user.comments)
  @Field((type) => User)
  user: User

  @RelationId((comment: Comment) => comment.user)
  userId: number

  @ManyToOne((type) => Project, (project) => project.comments)
  @Field((type) => Project)
  project: Project

  @RelationId((comment: Comment) => comment.project)
  projectId: number
}
