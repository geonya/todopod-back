import { Task } from '../entities/task.entity'
import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'

@InputType('DeleteTaskInputType')
export class DeleteTaskInput extends PickType(Task, ['id']) {}

@ObjectType()
export class DeleteTaskOutput extends CoreOutput {}
