import { Test, TestingModule } from '@nestjs/testing'
import { CONFIG_OPTIONS } from '../jwt/jwt.constats'
import { EmailService } from './email.service'
import * as mailgun from 'mailgun-js'

jest.mock('mailgun-js')

const TEST_DOMAIN = 'test-domain.com'
describe('EmailService', () => {
  let service: EmailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'testApiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-email@test.com',
          },
        },
      ],
    }).compile()

    service = module.get<EmailService>(EmailService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('sendEmail', () => {
    it('should sendEmail', async () => {
      const sendEmailArgs = {
        subject: 'hello',
        to: 'hi@hi.com',
        template: 'test-temp',
        emailVars: {
          username: 'tester',
          code: 'test-code',
        },
      }
      const mg = mailgun({ apiKey: 'aa', domain: TEST_DOMAIN })
      const data = {
        from: 'a',
        subject: 'hello',
        to: 'hi@hi.com',
        template: 'test-temp',
        'h:X-Mailgun-Variables': JSON.stringify(sendEmailArgs.emailVars),
      }
      jest
        .spyOn(mailgun({ apiKey: 'aa', domain: TEST_DOMAIN }), 'messages')
        .mockResolvedValue({
          send: (data, cb) => console.log({ message: 'a', id: 'hi' }),
        })
      const result = await service.sendEmail(sendEmailArgs)
      expect(result).toEqual({ ok: true })
    })
  })
})
