import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Todo } from '../entities/todo.entity'

@InputType('EditTodoInputType')
export class EditTodoInput extends PickType(Todo, [
  'id',
  'payload',
  'process',
]) {
  @Field((type) => [String], { nullable: true })
  tagNames?: string[]
}

@ObjectType()
export class EditTodoOutput extends CoreOutput {}
