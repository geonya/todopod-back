import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Project } from '../../project/entities/project.entity'
import { Task } from '../../task/entities/task.entity'
import { User } from '../../user/entities/user.entity'

@InputType('PhotoInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Photo extends CoreEntity {
  @Column()
  @Field((type) => String)
  url: string

  @Column()
  @Field((type) => String)
  key: string

  @Column()
  @Field((type) => String)
  caption: string

  @ManyToOne((type) => User, (user) => user.photos, { onDelete: 'CASCADE' })
  creator: User

  @RelationId((photo: Photo) => photo.creator)
  userId: number

  @ManyToOne((type) => Project, (project) => project.photos, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  project?: Project

  @Field((type) => Int, { nullable: true })
  @RelationId((photo: Photo) => photo.project)
  projectId?: number

  @ManyToOne((type) => Task, (task) => task.photos, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  task?: Task

  @Field((type) => Int, { nullable: true })
  @RelationId((photo: Photo) => photo.task)
  taskId: number
}
