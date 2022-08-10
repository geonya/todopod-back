import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType('DeleteAccountInputType')
export class DeleteAccountInput extends PickType(User, ['id']) {}

@ObjectType()
export class DeleteAccountOutput extends CoreOutput {}
