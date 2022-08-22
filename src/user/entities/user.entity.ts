import { InternalServerErrorException } from '@nestjs/common'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsString, Length } from 'class-validator'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import * as bcrypt from 'bcrypt'
import { Project } from '../../project/entities/project.entity'
import { Task } from '../../task/entities/task.entity'
import { Comment } from '../../project/entities/comment.entity'
import { Todo } from '../../todo/entities/todo.entity'
import { Photo } from '../../photo/entities/photo.entity'
import { Team } from '../../team/entities/team.entity'

export enum UserRole {
  Client = 'Client',
  Producer = 'Producer',
  Admin = 'Admin',
}
registerEnumType(UserRole, { name: 'UserRole' })

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 10)
  name: string

  @Column()
  @Field((type) => String)
  @IsString()
  @Length(4)
  password: string

  @Column({ default: 'geony@geony.com' })
  @Field((type) => String)
  @IsEmail()
  email: string

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  company?: string

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  address?: string

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  avatar?: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Client,
  })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole

  @Field((type) => [Project], { nullable: true })
  @OneToMany((type) => Project, (project) => project.creator, {
    nullable: true,
  })
  projects?: Project[]

  @Field((type) => [Task], { nullable: true })
  @OneToMany((type) => Task, (task) => task.creator, { nullable: true })
  tasks?: Task[]

  @Field((type) => [Comment], { nullable: true })
  @OneToMany((type) => Comment, (comment) => comment.user, { nullable: true })
  comments?: Comment[]

  @Field((type) => [Todo], { nullable: true })
  @OneToMany((type) => Todo, (todo) => todo.user, { nullable: true })
  todos: Todo[]

  @Field((type) => Boolean, { defaultValue: false })
  verified: boolean

  @Field((type) => [Photo], { nullable: true })
  @OneToMany((type) => Photo, (photo) => photo.creator, { nullable: true })
  photos?: Photo[]

  @ManyToOne((type) => Team, (team) => team.users, { nullable: true })
  @Field((type) => Team, { nullable: true })
  team?: Team

  @RelationId((user: User) => user.team)
  teamId: number

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('hashPassword error')
    }
  }
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(aPassword, this.password)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('checkPassowrd error')
    }
  }
}
