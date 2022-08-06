import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, ['name', 'password']) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
