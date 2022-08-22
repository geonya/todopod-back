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

  @Column()
  @Field((type) => Int)
  @IsInt()
  leaderId: number

  @Field((type) => [User])
  @OneToMany((type) => User, (user) => user.team)
  users?: User[]
}
