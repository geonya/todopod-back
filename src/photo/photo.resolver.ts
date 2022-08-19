import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { GraphQLUpload, type FileUpload } from 'graphql-upload-minimal'
import { AuthUser } from '../auth/auth-user.decorator'
import { Role } from '../auth/role.decorator'
import { User } from '../user/entities/user.entity'
import { CreatePhotoInput, CreatePhotoOutput } from './dtos/create-photo.dto'
import { DeletePhotoInput, DeletePhotoOutput } from './dtos/delete-photo.dto'
import { EditPhotoInput, EditPhotoOutput } from './dtos/edit-photo.dto'
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

  @Mutation((returns) => EditPhotoOutput)
  @Role(['Any'])
  async editPhoto(
    @AuthUser() creator: User,
    @Args('input') editPhotoInput: EditPhotoInput,
  ): Promise<EditPhotoOutput> {
    return this.photoService.editPhoto(creator, editPhotoInput)
  }

  @Mutation((returns) => DeletePhotoOutput)
  @Role(['Any'])
  async deletePhoto(
    @AuthUser() creator: User,
    @Args('input') deletePhotoInput: DeletePhotoInput,
  ): Promise<DeletePhotoOutput> {
    return this.photoService.deletePhoto(creator, deletePhotoInput)
  }
}
