import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateAccountInputType')
export class CreateAccountInput {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  password: string;
}
