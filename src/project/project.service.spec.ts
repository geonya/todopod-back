import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import errorMessage from '../common/constants/error-messages.constants'
import { User, UserRole } from '../user/entities/user.entity'
import { Project } from './entities/project.entity'
import { ProjectService } from './project.service'

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  findOneByOrFail: jest.fn(),
})
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('ProjectService', () => {
  let projectService: ProjectService
  let projectRepostiory: MockRepository<Project>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository(),
        },
      ],
    }).compile()

    projectService = module.get<ProjectService>(ProjectService)
    projectRepostiory = module.get(getRepositoryToken(Project))
  })

  it('should be defined', () => {
    expect(projectService).toBeDefined()
  })
  const mockUser = {
    id: 1,
    email: 'test@test.com',
    name: 'test',
    password: '1234',
    role: UserRole.Producer,
  }
  const mockProject = {
    id: 1,
    title: 'abcd',
    description: 'abcdefg',
    creatorId: 1,
  }

  describe('createProject', () => {
    it('should fail on Exception', async () => {
      projectRepostiory.save.mockRejectedValue(new Error())
      const result = await projectService.createProject(
        mockUser as User,
        mockProject,
      )
      expect(result).toEqual({
        ok: false,
        error: errorMessage.ko.common.internalError + 'createProject',
      })
    })
    it('should success creating project', async () => {
      projectRepostiory.create.mockResolvedValue(mockProject)
      projectRepostiory.save.mockResolvedValue(mockProject)
      const result = await projectService.createProject(
        mockUser as User,
        mockProject,
      )
      expect(result).toEqual({
        ok: true,
      })
    })
  })
})
