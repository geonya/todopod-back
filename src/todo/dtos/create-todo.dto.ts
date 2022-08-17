import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Todo } from '../entities/todo.entity'

@InputType('CreateTodoInputType')
export class CreateTodoInput extends PickType(Todo, ['payload', 'taskId']) {
  @Field((type) => [String], { nullable: true })
  tagNames?: string[]
}

@ObjectType()
export class CreateTodoOutput extends CoreOutput {}
