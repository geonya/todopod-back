import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Project } from '../entities/project.entity'

@InputType('EditProjectInputType')
export class EditProjectInput extends PartialType(
  PickType(Project, ['id', 'title', 'description']),
) {
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  tagNames?: string[]

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  inviteUserId?: number

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  withdrawUserId?: number
}

@ObjectType()
export class EditProjectOutput extends CoreOutput {}
