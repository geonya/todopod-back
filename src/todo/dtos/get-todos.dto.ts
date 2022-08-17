import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Todo } from '../entities/todo.entity'

@InputType('GetTodosInputType')
export class GetTodosInput extends PickType(Todo, ['taskId']) {
  @Field((type) => Int, { defaultValue: 1 })
  pages: number
}

@ObjectType()
export class GetTodosOutput extends CoreOutput {
  @Field((type) => [Todo], { nullable: true })
  todos?: Todo[]
}
