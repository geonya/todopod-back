import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { string } from 'joi'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('CreateProjectInput')
export class CreateProjectInput extends PickType(Project, ['title']) {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string

  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  tagNames?: string[]
}

@ObjectType()
export class CreateProjectOutput extends CoreOutput {}
