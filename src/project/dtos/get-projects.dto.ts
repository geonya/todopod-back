import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsInt } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('GetProjectInputType')
export class GetProjectsInput {
  @Field((type) => Int, { nullable: true })
  @IsInt()
  page?: number
}

@ObjectType()
export class GetProjectsOutput extends CoreOutput {
  @Field((type) => [Project], { nullable: true })
  projects?: Project[]
}
