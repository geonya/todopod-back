import { UseGuards } from '@nestjs/common'
import {
  Args,
  Context,
  GqlContextType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { AuthUser } from '../auth/auth-user.decorator'
import { AuthGuard } from '../auth/auth.guard'
import { Role } from '../auth/role.decorator'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account-dto'
import {
  DeleteAccountInput,
  DeleteAccountOutput,
} from './dtos/delete-account.dto'
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto'
import {
  FindUserByIdInput,
  FindUserByIdOutput,
} from './dtos/find-user-by-id.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { MyProfileOutput } from './dtos/myProfile.dto'
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto'
import { User, UserRole } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Queries
  @Query((returns) => FindUserByIdOutput)
  @Role(['Any'])
  findUserById(
    @Args('input') { id }: FindUserByIdInput,
  ): Promise<FindUserByIdOutput> {
    return this.userService.findUserById(id)
  }

  @Query((returns) => MyProfileOutput)
  @Role(['Any'])
  getMyProfile(@AuthUser() authUser: User): Promise<MyProfileOutput> {
    return this.userService.getMyProfile(authUser)
  }

  // Mutations
  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput)
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput)
  }

  @Mutation((returns) => EditAccountOutput)
  @Role(['Any'])
  editAccount(
    @AuthUser() { id }: User,
    @Args('input') editAccountInput: EditAccountInput,
  ): Promise<EditAccountOutput> {
    return this.userService.editAccount(id, editAccountInput)
  }

  @Mutation((returns) => DeleteAccountOutput)
  @Role(['Any'])
  deleteAccount(
    @AuthUser() user: User,
    @Args('input') deleteAccountInput: DeleteAccountInput,
  ) {
    return this.userService.deleteAccount(user, deleteAccountInput)
  }

  @Mutation((returns) => VerifyEmailOutput)
  @Role(['Any'])
  verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(verifyEmailInput)
  }
}
