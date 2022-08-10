import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { exists } from 'fs'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/errorMessage.constants'
import { JwtService } from '../jwt/jwt.service'
import { User, UserRole } from './entities/user.entity'
import { UserService } from './user.service'

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  findOneByOrFail: jest.fn(),
})

const mockJwtService = () => ({
  sign: jest.fn(() => 'mocked token'),
  verify: jest.fn(),
})

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('UserService', () => {
  let userService: UserService
  let userRepository: MockRepository<User>
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        { provide: JwtService, useValue: mockJwtService() },
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get(getRepositoryToken(User))
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
    expect(jwtService).toBeDefined()
  })

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    name: 'test',
    password: '1234',
    role: UserRole.Client,
  }
  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        ...mockUser,
      })
      const result = await userService.createAccount(mockUser)
      expect(result).toEqual({
        ok: false,
        error: errorMessage.ko.user.emailExisting,
      })
    })
    it('should create new user', async () => {
      userRepository.findOne.mockResolvedValue(null)
      userRepository.create.mockReturnValue({
        ...mockUser,
      })
      userRepository.save.mockResolvedValue({ ...mockUser })
      const result = await userService.createAccount(mockUser)
      expect(userRepository.findOne).toHaveBeenCalledTimes(1)
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      })
      expect(userRepository.create).toHaveBeenCalledTimes(1)
      expect(userRepository.create).toHaveBeenCalledWith(mockUser)
      expect(userRepository.save).toHaveBeenCalledTimes(1)
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
      })
      expect(result).toEqual({ ok: true })
    })
    it('should fail on exception', async () => {
      userRepository.save.mockRejectedValue(new Error())
      const result = await userService.createAccount(mockUser)
      expect(result).toEqual({
        ok: false,
        error: errorMessage.ko.common.internalError + 'createAccount',
      })
    })
    describe('login', () => {
      const loginArgs = {
        email: 'test@test.com',
        password: '1234',
      }
      it("'should fail if user doesn't exists", async () => {
        userRepository.findOne.mockResolvedValue(null)
        const result = await userService.login(loginArgs)
        expect(userRepository.findOne).toHaveBeenCalledTimes(1)
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: loginArgs.email,
          },
        })
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.user.userNotFound,
        })
      })
      it('should fail if password is wrong', async () => {
        const pwWrongUser = {
          ...mockUser,
          checkPassword: jest.fn(() => Promise.resolve(false)),
        }
        userRepository.findOne.mockResolvedValue({ ...pwWrongUser })
        const result = await userService.login(loginArgs)
        expect(userRepository.findOne).toHaveBeenCalledTimes(1)
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: loginArgs.email,
          },
        })
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.user.passwordWrong,
        })
      })

      it('should return token if login is success', async () => {
        const pwTrueUser = {
          ...mockUser,
          checkPassword: jest.fn(() => Promise.resolve(true)),
        }
        userRepository.findOne.mockResolvedValue(pwTrueUser)
        const result = await userService.login(loginArgs)
        expect(jwtService.sign).toHaveBeenCalledTimes(1)
        expect(jwtService.sign).toHaveBeenCalledWith(pwTrueUser.id)
        expect(result).toEqual({
          ok: true,
          token: expect.any(String),
        })
      })
      it('should fail on exception', async () => {
        userRepository.findOne.mockRejectedValue(new Error())
        const result = await userService.login(loginArgs)
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.common.internalError + 'login',
        })
      })
    })
    describe('findUserById', () => {
      it("should fail if user dosen't exists", async () => {
        userRepository.findOne.mockResolvedValue(null)
        const result = await userService.findUserById(mockUser.id)
        expect(userRepository.findOne).toHaveBeenCalledTimes(1)
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.user.userNotFound,
        })
      })
      it('should find user', async () => {
        userRepository.findOne.mockResolvedValue({ ...mockUser })
        const result = await userService.findUserById(mockUser.id)
        expect(userRepository.findOne).toHaveBeenCalledTimes(1)
        expect(result).toEqual({
          ok: true,
          user: mockUser,
        })
      })
      it('should fail on exception', async () => {
        userRepository.findOne.mockRejectedValue(new Error())
        const result = await userService.findUserById(mockUser.id)
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.common.internalError + 'findUserById',
        })
      })
    })
    describe('getMyProfile', () => {
      it('should find user', async () => {
        const result = await userService.getMyProfile(mockUser as User)
        expect(result).toMatchObject({
          ok: true,
          user: mockUser,
        })
      })
      it('should fail user null', async (user = null) => {
        const result = await userService.getMyProfile(user)
        expect(result).toMatchObject({
          ok: false,
          error: errorMessage.ko.user.notAuthorized,
        })
      })
    })
    describe('editAccount', () => {
      const editAccountArgs = {
        name: 'test',
        email: 'test2@test.com',
        password: 'test',
        address: 'test',
        company: 'test',
        avatar: 'test',
        role: UserRole.Producer,
      }
      it('should fail if not found user', async () => {
        userRepository.findOne.mockResolvedValue(null)
        const result = await userService.editAccount(
          mockUser.id,
          editAccountArgs,
        )
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.user.userNotFound,
        })
      })
      it('should fail if email exsits', async () => {
        userRepository.findOne.mockResolvedValue({ ...mockUser })
        const result = await userService.editAccount(
          mockUser.id,
          editAccountArgs,
        )
        expect(userRepository.findOne).toBeCalledWith({
          where: {
            email: editAccountArgs.email,
          },
        })
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.user.emailExisting,
        })
      })
      it('should success edit account', async () => {
        userRepository.findOne.mockResolvedValueOnce({
          ...mockUser,
        })
        userRepository.save.mockResolvedValue(editAccountArgs)
        const result = await userService.editAccount(
          mockUser.id,
          editAccountArgs,
        )
        expect(userRepository.save).toHaveBeenCalledTimes(1)
        expect(userRepository.save).toHaveBeenCalledWith({
          id: mockUser.id,
          ...editAccountArgs,
        })
        expect(result).toEqual({
          ok: true,
        })
      })
      it('should fail on exception', async () => {
        userRepository.findOne.mockResolvedValueOnce({ ...mockUser })
        userRepository.findOne.mockResolvedValueOnce(null)
        userRepository.save.mockRejectedValue(new Error())
        const result = await userService.editAccount(
          mockUser.id,
          editAccountArgs,
        )
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.common.internalError + 'editAccount',
        })
      })
    })
    describe('deleteAccount', () => {
      it('should fail user does not have authorization', async () => {
        userRepository.findOne.mockResolvedValue({
          mockUser,
        })
        const result = await userService.deleteAccount(
          { ...mockUser, id: 2 } as User,
          { id: 1 },
        )
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.user.notAuthorized,
        })
      })
      it('should fail when user not found', async () => {
        userRepository.findOne.mockResolvedValue(null)
        const result = await userService.deleteAccount(mockUser as User, {
          id: 1,
        })
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.user.userNotFound,
        })
      })
      it('should fail on exception', async () => {
        userRepository.findOne.mockRejectedValue(new Error())
        const result = await userService.deleteAccount(mockUser as User, {
          id: 1,
        })
        expect(result).toEqual({
          ok: false,
          error: errorMessage.ko.common + 'deleteAccount',
        })
      })
      it('should delete success', async () => {
        userRepository.findOne.mockResolvedValue({
          mockUser,
        })
        const result = await userService.deleteAccount(mockUser as User, {
          id: 1,
        })
        expect(result).toEqual({
          ok: true,
        })
      })
    })
  })
})
