import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { Team } from './entities/team.entity'
import { TeamResolver } from './team.resolver'
import { TeamService } from './team.service'

@Module({
  imports: [TypeOrmModule.forFeature([Team, User])],
  providers: [TeamService, TeamResolver],
})
export class TeamModule {}
