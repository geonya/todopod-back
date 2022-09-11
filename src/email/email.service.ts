import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../jwt/jwt.constats'
import { EmailModuleOptions } from './email.interfaces'
import * as mailgun from 'mailgun-js'
import { SendEmailInput, SendEmailOutput } from './dtos/send-email.dto'

@Injectable()
export class EmailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: EmailModuleOptions,
  ) {}

  async sendEmail({
    subject,
    to,
    template,
    emailVars,
  }: SendEmailInput): Promise<SendEmailOutput> {
    try {
      const mg = mailgun({
        apiKey: this.options.apiKey,
        domain: this.options.domain,
      })
      const data = {
        from: this.options.fromEmail,
        to,
        subject,
        template,
        'h:X-Mailgun-Variables': JSON.stringify(emailVars),
      }
      await mg.messages().send(data, (error, body) => {
        if (error) {
          console.error(error)
          throw new Error(error.message)
        }
      })
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error,
      }
    }
  }
}
