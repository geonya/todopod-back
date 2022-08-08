import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  Client,
  Producer,
  Admin,
}
registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
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
  @IsString()
  company?: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  address?: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Client,
  })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('hashPassword error');
    }
  }
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(aPassword, this.password);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('checkPassowrd error');
    }
  }
}
