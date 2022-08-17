import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Task } from '../entities/task.entity'

@InputType('GetTasksInputType')
export class GetTasksInput extends PickType(Task, ['projectId']) {
  @Field((type) => Int, { defaultValue: 1 })
  pages?: number
}

@ObjectType()
export class GetTasksOutput extends CoreOutput {
  @Field((type) => [Task], { nullable: true })
  tasks?: Task[]
}
