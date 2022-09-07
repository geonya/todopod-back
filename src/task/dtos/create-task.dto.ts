import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Task } from '../entities/task.entity'

@InputType('CreateTaskInput')
export class CreateTaskInput extends PickType(Task, ['name', 'projectId']) {
  @Field((type) => [String], { nullable: true })
  @IsOptional({ each: true })
  @IsString({ each: true })
  tagsName?: string[]

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string
}

@ObjectType()
export class CreateTaskOutput extends CoreOutput {}
