import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('CreateProjectInputType')
export class CreateProjectInput extends PickType(Project, [
  'title',
  'description',
]) {
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  tagNames?: string[]
}

@ObjectType()
export class CreateProjectOutput extends CoreOutput {}
