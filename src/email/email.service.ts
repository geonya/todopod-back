import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../jwt/jwt.constats'
import { EmailModuleOptions, IEmailVars } from './email.interfaces'
import mailgun from 'mailgun-js'
import errorMessage from '../common/constants/error-messages.constants'

@Injectable()
export class EmailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: EmailModuleOptions,
  ) {}

  async sendEmail(
    subject: string,
    template: string,
    emailVars: IEmailVars,
    to: string,
  ): Promise<boolean> {
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
        emailVars,
      }
      mg.messages().send(data, (error, body) => {
        if (error) {
          throw new Error(error.message)
        }
        console.log(body)
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
