import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Photo } from '../entities/photo.entity'

@InputType('EditPhotoInputType')
export class EditPhotoInput extends PickType(Photo, ['id', 'caption']) {}

@ObjectType()
export class EditPhotoOutput extends CoreOutput {}
