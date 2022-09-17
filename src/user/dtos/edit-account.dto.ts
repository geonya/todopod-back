import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal'
import { CoreOutput } from '../../common/dtos/output.dto'
import { User } from '../entities/user.entity'

@InputType('EditAccountInput')
export class EditAccountInput extends PartialType(
  PickType(User, [
    'name',
    'email',
    'password',
    'address',
    'company',
    'avatar',
    'role',
  ]),
) {
  @Field((type) => GraphQLUpload, { nullable: true })
  file?: Promise<FileUpload>
}

@ObjectType()
export class EditAccountOutput extends CoreOutput {}
