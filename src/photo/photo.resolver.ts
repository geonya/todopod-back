import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { GraphQLUpload, type FileUpload } from 'graphql-upload-minimal'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
import { User } from '../user/entities/user.entity'
import { CreatePhotoInput, CreatePhotoOutput } from './dtos/create-photo.dto'
import { Photo } from './entities/photo.entity'
import { PhotoService } from './photo.service'

@Resolver((of) => Photo)
export class PhotoResolver {
  constructor(private readonly photoService: PhotoService) {}

  @Mutation((returns) => CreatePhotoOutput)
  @Role(['Any'])
  async createPhoto(
    @AuthUser() creator: User,
    @Args('input')
    createPhotoInput: CreatePhotoInput,
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<CreatePhotoOutput> {
    return this.photoService.createPhoto(creator, createPhotoInput, file)
  }
}
