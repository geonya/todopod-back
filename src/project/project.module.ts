import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmExModule } from '../common/repositories/typeorm-ex-module'
import { Tag } from '../tag/entities/tag.entity'
import { TagRepository } from '../tag/repositories/tag.repository'
import { User } from '../user/entities/user.entity'
import { Comment } from './entities/comment.entity'
import { Project } from './entities/project.entity'
import { ProjectResolver } from './project.resolver'
import { ProjectService } from './project.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Tag, Comment, User]),
    TypeOrmExModule.forCustomRepository([TagRepository]),
  ],
  providers: [ProjectService, ProjectResolver],
})
export class ProjectModule {}
