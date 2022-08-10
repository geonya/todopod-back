import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString, Length } from 'class-validator'
import { Column, Entity, OneToMany } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Project } from '../../project/entities/project.entity'

@InputType('TagInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Tag extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  @Length(2)
  name: string

  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  slug: string
}
