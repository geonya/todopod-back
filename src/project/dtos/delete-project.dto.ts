import { InputType, ObjectType, PickType } from '@nestjs/graphql'

import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('DeleteProjectInputType')
export class DeleteProjectInput extends PickType(Project, ['id']) {}

@ObjectType()
export class DeleteProjectOutput extends CoreOutput {}
