import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from '../project/entities/project.entity'
import { Task } from '../task/entities/task.entity'
import { Photo } from './entities/photo.entity'
import { PhotoResolver } from './photo.resolver'
import { PhotoService } from './photo.service'

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Project, Task])],
  providers: [PhotoService, PhotoResolver],
})
export class PhotoModule {}
