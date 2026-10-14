import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ENV_FILE } from './config/env.js';
import { EmailModule } from './email/email.module.js';
import { EmailService } from './email/email.service.js';
import { createAuth } from './auth/auth.js';
import { StoreModule } from './dashboard/store/store.module.js';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ENV_FILE }),
    EmailModule,
    AuthModule.forRootAsync({
      imports: [EmailModule],
      inject: [ConfigService, EmailService],
      useFactory: (config: ConfigService, email: EmailService) => ({
        auth: createAuth(config, email),
      }),
    }),
    StoreModule,
  ],
})
export class AppModule {}