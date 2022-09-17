import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Joi from 'joi'
import { UserModule } from './user/user.module'
import { JwtModule } from './jwt/jwt.module'
import { JwtMiddleware } from './jwt/jwt.middleware'
import { AuthModule } from './auth/auth.module'
import { ProjectModule } from './project/project.module'
import { EmailModule } from './email/email.module'
import { TaskModule } from './task/task.module'
import { TodoModule } from './todo/todo.module'
import { PhotoModule } from './photo/photo.module'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import { TeamModule } from './team/team.module'
import * as cookieParser from 'cookie-parser'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      synchronize: process.env.NODE_ENV !== 'prod',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      bodyParserConfig: false,
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    EmailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    TaskModule,
    TodoModule,
    PhotoModule,
    TeamModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        JwtMiddleware,
        graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }),
      )
      .forRoutes({ path: '/graphql', method: RequestMethod.POST })
  }
}
