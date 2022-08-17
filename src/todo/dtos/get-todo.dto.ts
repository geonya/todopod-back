import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Todo } from '../entities/todo.entity'

@InputType('GetTodoInputType')
export class GetTodoInput extends PickType(Todo, ['id']) {}

@ObjectType()
export class GetTodoOutput extends CoreOutput {
  @Field((type) => Todo, { nullable: true })
  todo?: Todo
}
