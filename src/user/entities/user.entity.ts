import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InputType('UserInput', { isAbstract: true })
@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @CreateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;

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
}
