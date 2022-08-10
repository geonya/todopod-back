import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsInt } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('GetProjectsInputType')
export class GetProjectsInput {
  @Field((type) => Int, { defaultValue: 1 })
  @IsInt()
  page?: number
}

@ObjectType()
export class GetProjectsOutput extends CoreOutput {
  @Field((type) => [Project], { nullable: true })
  projects?: Project[]

  @Field((type) => Int, { nullable: true })
  totalProjectsCount?: number

  @Field((type) => Int, { nullable: true })
  totalPages?: number
}
