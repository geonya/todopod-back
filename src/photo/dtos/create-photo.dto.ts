import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Photo } from '../entities/photo.entity'

@InputType('CreatePhotoInputType')
export class CreatePhotoInput extends PickType(Photo, [
  'caption',
  'projectId',
  'taskId',
]) {}

@ObjectType()
export class CreatePhotoOutput extends CoreOutput {}
