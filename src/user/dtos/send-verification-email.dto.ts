import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'

@InputType('SendVerificationEmailInput')
export class SendVerificationEmailInput {
  @Field((type) => String)
  email: string
}

@ObjectType()
export class SendVerificationEmailOutput extends CoreOutput {}
