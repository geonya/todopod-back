import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { S3 } from 'aws-sdk'
import type { FileUpload } from 'graphql-upload-minimal'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/error-messages.constants'
import { Project } from '../project/entities/project.entity'
import { Task } from '../task/entities/task.entity'
import { User } from '../user/entities/user.entity'
import { CreatePhotoInput, CreatePhotoOutput } from './dtos/create-photo.dto'
import { DeletePhotoInput, DeletePhotoOutput } from './dtos/delete-photo.dto'
import { EditPhotoInput, EditPhotoOutput } from './dtos/edit-photo.dto'
import { Photo } from './entities/photo.entity'

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photos: Repository<Photo>,

    @InjectRepository(Project)
    private readonly projects: Repository<Project>,

    @InjectRepository(Task)
    private readonly tasks: Repository<Task>,

    private readonly configService: ConfigService,
  ) {}

  async createPhoto(
    creator: User,
    createPhotoInput: CreatePhotoInput,
    { createReadStream }: FileUpload,
  ): Promise<CreatePhotoOutput> {
    try {
      const photo = this.photos.create(createPhotoInput)
      photo.creator = creator
      if (createPhotoInput.projectId) {
        const id = createPhotoInput.projectId
        const project = await this.projects.findOne({ where: { id } })
        if (!project) {
          return {
            ok: false,
            error: errorMessage.ko.project.notFound,
          }
        }
        photo.project = project
      }

      if (createPhotoInput.taskId) {
        const id = createPhotoInput.taskId
        const task = await this.tasks.findOne({ where: { id } })
        if (!task) {
          return {
            ok: false,
            error: errorMessage.ko.task.notFound,
          }
        }
        photo.task = task
      }

      //S3 photo upload
      const readStream = createReadStream()
      const s3 = new S3()
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: readStream,
          Key: `photo/${creator.id}-${Date.now()}`,
        })
        .promise()
      photo.key = uploadResult.Key
      photo.url = uploadResult.Location
      await this.photos.save(photo)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'createPhoto',
      }
    }
  }

  async editPhoto(
    creator: User,
    { id, caption }: EditPhotoInput,
  ): Promise<EditPhotoOutput> {
    try {
      const photo = await this.photos.findOne({ where: { id } })
      if (!photo) {
        return {
          ok: false,
          error: errorMessage.ko.photo.notFound,
        }
      }
      if (creator.id !== photo.userId) {
        return {
          ok: false,
          error: errorMessage.ko.photo.notAuthorized,
        }
      }
      photo.caption = caption
      await this.photos.save(photo)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'editPhoto',
      }
    }
  }

  async deletePhoto(
    creator: User,
    { id }: DeletePhotoInput,
  ): Promise<DeletePhotoOutput> {
    try {
      const photo = await this.photos.findOne({ where: { id } })
      if (!photo) {
        return {
          ok: false,
          error: errorMessage.ko.photo.notFound,
        }
      }
      if (creator.id !== photo.userId) {
        return {
          ok: false,
          error: errorMessage.ko.photo.notAuthorized,
        }
      }
      // delete photo
      const s3 = new S3()
      await s3
        .deleteObject({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Key: photo.key,
        })
        .promise()
      await this.photos.delete(id)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: errorMessage.ko.common.internalError + 'deletePhoto',
      }
    }
  }
}
