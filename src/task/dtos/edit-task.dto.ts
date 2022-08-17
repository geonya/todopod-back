import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Task } from '../entities/task.entity'

@InputType('EditTaskInputType')
export class EditTaskInput extends PickType(Task, [
  'id',
  'description',
  'name',
]) {
  @Field((type) => [String], { nullable: true })
  tagNames?: string[]
}

@ObjectType()
export class EditTaskOutput extends CoreOutput {}
