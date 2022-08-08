import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../user/entities/user.entity';

@InputType('ProjectInputType')
@ObjectType()
@Entity()
export class Project extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 20)
  title: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.projects)
  creator: User;

  @RelationId((project: Project) => project.creator)
  creatorId: number;
}
