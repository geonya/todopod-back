import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { config } from 'aws-sdk'
import { AppModule } from './app.module'
import { JwtMiddleware } from './jwt/jwt.middleware'

const PORT = 4000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService)
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  })
  await app.listen(PORT, () =>
    console.log(`🚀server is running! http://localhost:${PORT}/graphql  🚀`),
  )
}
bootstrap()
