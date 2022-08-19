import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Photo } from '../entities/photo.entity'

@InputType('DeletePhotoInput')
export class DeleteInput extends PickType(Photo, ['id']) {}

@ObjectType()
export class DeleteOutput extends CoreOutput {}
