import { InternalServerErrorException } from '@nestjs/common'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator'
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

@InputType('AvatarInput', { isAbstract: true })
@ObjectType()
export class Avatar {
  @Field((type) => String)
  url: string

  @Field((type) => String)
  key: string
}

export enum UserRole {
  Client = 'Client',
  Producer = 'Producer',
  Admin = 'Admin',
}
registerEnumType(UserRole, { name: 'UserRole' })

@InputType('UserInput', { isAbstract: true })
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

  @Column({ type: 'json', nullable: true })
  @Field((type) => Avatar, { nullable: true })
  avatar?: Avatar

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
    onDelete: 'SET NULL',
  })
  myProjects?: Project[]

  @Field((type) => [Task], { nullable: true })
  @OneToMany((type) => Task, (task) => task.creator, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  tasks?: Task[]

  @Field((type) => [Comment], { nullable: true })
  @OneToMany((type) => Comment, (comment) => comment.user, { nullable: true })
  comments?: Comment[]

  @Field((type) => [Todo], { nullable: true })
  @OneToMany((type) => Todo, (todo) => todo.user, { nullable: true })
  todos: Todo[]

  @Column({ default: false })
  @Field((type) => Boolean, { defaultValue: false })
  verified: boolean

  @Field((type) => [Photo], { nullable: true })
  @OneToMany((type) => Photo, (photo) => photo.creator, { nullable: true })
  photos?: Photo[]

  @ManyToOne((type) => Team, (team) => team.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => Team, { nullable: true })
  team?: Team

  @RelationId((user: User) => user.team)
  teamId?: number

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch (error) {
        console.error(error)
        throw new InternalServerErrorException('hashPassword error')
      }
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
