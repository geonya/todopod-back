import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Verification } from '../../user/entities/verification.entity'
import { IEmailVars } from '../email.interfaces'

@InputType('SendEmailInputType')
export class SendEmailInput {
  @Field((type) => String)
  subject: string
  @Field((type) => String)
  to: string
  @Field((type) => String)
  template: string
  @Field((type) => Object)
  emailVars: IEmailVars
}

@ObjectType()
export class SendEmailOutput extends CoreOutput {}
