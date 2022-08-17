import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Task } from '../entities/task.entity'

@InputType('CreateTaskInputType')
export class CreateTaskInput extends PickType(Task, [
  'name',
  'projectId',
  'description',
]) {
  @Field((type) => [String], { nullable: true })
  @IsString({ each: true })
  tagsName?: string[]
}

@ObjectType()
export class CreateTaskOutput extends CoreOutput {}
