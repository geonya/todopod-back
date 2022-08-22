import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { IsInt, IsString, Length } from 'class-validator'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { User } from '../../user/entities/user.entity'

@InputType('TeamInputType')
@ObjectType()
@Entity()
export class Team extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  @Length(2)
  name: string

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  leaderId: number

  @Field((type) => [User], { nullable: true })
  @OneToMany((type) => User, (user) => user.team, { onDelete: 'SET NULL' })
  users?: User[]
}
