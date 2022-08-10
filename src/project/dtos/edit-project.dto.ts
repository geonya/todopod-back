import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('EditProjectInputType')
export class EditProjectInput extends PickType(Project, [
  'id',
  'title',
  'description',
]) {
  @Field((type) => [String], { nullable: true })
  @IsString({ each: true })
  tagNames?: string[]
}

@ObjectType()
export class EditProjectOutput extends CoreOutput {}
