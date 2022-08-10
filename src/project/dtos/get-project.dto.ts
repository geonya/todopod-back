import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('GetProjectInputType')
export class GetProjectInput extends PickType(Project, ['id']) {}

@ObjectType()
export class GetProjectOutput extends CoreOutput {
  @Field((type) => Project, { nullable: true })
  project?: Project
}
