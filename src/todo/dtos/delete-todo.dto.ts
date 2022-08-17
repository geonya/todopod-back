import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Todo } from '../entities/todo.entity'

@InputType('DeleteTodoInputType')
export class DeleteTodoInput extends PickType(Todo, ['id']) {}

@ObjectType()
export class DeleteTodoOutput extends CoreOutput {}
