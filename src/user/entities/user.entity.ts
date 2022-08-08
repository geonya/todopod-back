import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

enum UserRole {
  Client,
  Producer,
  Admin,
}
registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInput', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 10)
  name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  @Length(4)
  password: string;

  @Column({ default: 'geony@geony.com' })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  company?: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Client,
  })
  @Field((type) => UserRole)
  role: UserRole;
}
