import { DynamicModule, Global, Module } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../jwt/jwt.constats'
import { EmailModuleOptions } from './email.interfaces'
import { EmailService } from './email.service'

@Module({
  providers: [EmailService],
})
@Global()
export class EmailModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, EmailService],
      exports: [EmailService],
    }
  }
}
