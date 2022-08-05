import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAccountInput } from './dtos/create-account-dto';
import { User } from './entities/user.entity';

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => [User])
  users(@Args('id') id: number): User[] {
    console.log(id);
    return [];
  }
  @Mutation((returns) => Boolean)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): boolean {
    console.log(createAccountInput);
    return true;
  }
}
